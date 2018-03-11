<?php
/**
 * This file contains the TreeNode OK Object.
 *
 * Copyright (c) 2004-2018 Lubo Dyer. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 *
 * @package Objects
 * @subpackage Input
 */

/**
 * TreeNode - OK Object
 *
 * @package Objects
 * @subpackage Input
 */
class OK_Object_TreeNode extends OK_Object
{
    protected $_type = 'treenode';

    protected $changed = false;
    protected $class = 'OK_TREE';
    protected $custom = array();
    protected $disabled = false;
    protected $label;
    protected $icon;
    protected $title;
    protected $expanded = false;
    protected $selected = false;
    protected $load = true;
    protected $dropspot = false;
    protected $spacing = 0;

    public $root;

    /** @ignore */
    public $_nodes_only = false;
    /** @ignore */
    public $_index;
    /** @ignore */
    public $_max;
    /** @ignore */
    public $_prepend;
    /** @ignore */
    public $_client_ref;
    /** @ignore */
    protected $_app_id;


    protected $_accept = array('treenode');
    protected $_events = array('onaction', 'onbeforeload', 'onbeforeselect', 'onblur', 'onclick', 'oncontentloaded', 'oncontentloading', 'oncontextmenu', 'ondoubleclick', 'ondragover', 'ondragout', 'ondrop', 'onfocus', 'onkeydown', 'onkeypress', 'onkeyup', 'onload', 'onmousedown', 'onmouseout', 'onmouseover', 'onmouseup', 'onselect', 'onunload', 'onunselect');
    protected $_params = array('changed' ,'class', 'custom', 'disabled', 'icon', 'label', 'title', 'expanded', 'selected', 'load', 'dropspot', 'spacing');
    protected $_validate = array(
        'load' => 'bool',
        'disabled' => 'bool'
    );

    /**
     *
     *
     */
    protected function onbeforeload()
    {
        if ($this->engine)
            $this->_app_id = $this->engine->app_id;
    }

    /**
     *
     *
     */
    protected function onunload()
    {
        $this->root = false;
    }

    /**
     *
     *
     */
    public function select()
    {
        if ($this->root->_selected)
            $this->root->_selected->unselect();
        $this->root->_selected = $this;
        $this->selected = true;
        $p = $this->parent;
        while ($p->_type != 'tree')
        {
            $p->expanded = true;
            $p = $p->parent;
        }
    }

    public function unselect()
    {
        if ($this->root->_selected == $this->id)
            $this->root->_selected = null;
        $this->selected = false;
    }

    public function isParentExpanded()
    {
        if ($this->_nodes_only)
            return true;

        if ($this->parent->_type == 'tree')
            return true;
        elseif ($this->parent->expanded && $this->parent->isParentExpanded())
            return true;

        return false;
    }

    protected function _toHTML()
    {
        $index = $this->_index;
        $max = $this->_max;
        $prepend = $this->_prepend;

        if ($this->parent->_type == 'tree' && $max == 1)
            $this->expanded = true;
        elseif (!$this->load) {
            $this->expanded = false;
            $this->content->clear();
        }

        // --

        $icon_html = '';
        if ($this->icon) {
            $icon = $this->create('image', array('id' => $this->id.':icon', 'app_id' => $this->_app_id, 'src' => $this->icon, 'style' => "margin-right: " . $this->spacing . "px;"));
            $icon_html = sprintf('<td class="icon">%s</td>', $icon->toHTML());
        }

        // --

        $this->_client_ref = $this->client->init('OK_Object_TreeNode', $this->id, $this->label, $this->icon ? $icon->cache_id : null, $this->isParentExpanded(), !$this->disabled, $this->selected, $this->expanded, $this->load, $this->root->html, 0);
        $this->client->call($this->parent->_client_ref, 'add', $this->_client_ref);
        foreach ($this->custom as $key => $val) {
            $this->client->set($this->_client_ref, "custom['$key']", $val);
        }
        $this->process_events($this->_client_ref);

        // --

        $len = $this->content->length;
        for ($i=0; $i<$len; $i++) 
        {
            $item = $this->content->get($i);
            if (!($item instanceOf OK_Object_TreeNode)) {
                $this->label .= $this->content->itemToHTML($i);
                $this->content->remove($i);
                $i--; $len--;
            }
        }
        
        // --

        $html = "";
        if ($this->root->html) {
            $image_modifier = '';
            if ($this->root->skin) {
                if ($index == 1 && $this->parent->_type == 'tree')
                    $image_modifier = ($max > 1) ? 'top' : 'single';
                elseif ($index == $max)
                    $image_modifier = 'bottom';
                $image_name = $len || !$this->load ? ($this->expanded ? 'minus' : 'plus') : 'branch';
            } else
                $image_name = $len ? $this->expanded ? 'minus' : 'plus' : 'blank';

            $image = '';
            if (!($index == 1 && $max==1 && $this->parent->_type == 'tree')) {
                $img = $this->create('image', array('id' => $this->id.':nav', 'src' => $this->root->images . '/' . $image_name . $image_modifier . '.gif'));
                $image = sprintf("<td id='%s:nav' class='nav' style='white-space:nowrap;'>%s</td><td>%s</td>", $this->id, $prepend, $img->toHTML());
            }

            if ($this->parent->_type == 'tree' && $max==1)
                $newPrepend = "";
            elseif ($index < $max) {
                $img = $this->create('image', array('src' => $this->root->images . '/' . ($this->root->skin ? 'line' : 'blank') . '.gif'));
                $newPrepend = $prepend . preg_replace("/ id='[a-z0-9]+'/", "", $img->toHTML());
                $img->destroy();
            } else {
                $img = $this->create('image', array('src' => $this->root->images . '/' . ($this->root->skin ? 'linebottom' : 'blank') . '.gif'));
                $newPrepend = $prepend . preg_replace("/ id='[a-z0-9]+'/", "", $img->toHTML());
            }

            $node_class = $this->selected ? 'selected' : ($this->disabled ? 'disabled' : 'item');

            $html = sprintf('<table id="%s" class="%s" cellspacing="0" cellpadding="0" style="display: %s"><tr>%s%s<td id="%s:text" title="%s" class="%s">%s</td></tr></table>',
                $this->id,
                $this->class,
                $this->isParentExpanded() ? 'table' : 'none',
                $image,
                $icon_html,
                $this->id,
                $this->title,
                $node_class,
                $this->label);
                
            if ($this->dropspot) {
                $this->client->call('ok.dragdrop', 'addTarget', $this->id);
            };
        }

        // --

        // Fetch child nodes
        for ($i=0; $i<$len; $i++) {
            $item = $this->content->get($i);
            $item->root = $this->root;
            $item->_index = $i+1;
            $item->_max = $len;

            if ($this->root->html) {
                $item->_prepend = $newPrepend;
            };
            $html .= $item->toHTML();
        } 

        return $html;
    }
}
