<?php
/**
 * This file contains the Tree OK Object.
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
 * Tree - OK Object
 *
 * @package Objects
 * @subpackage Input
 */
class OK_Object_Tree extends OK_Object
{
    protected $_type = 'tree';

    protected $collapse = false;
    protected $autoexpand = true;
    protected $bgcolor = 'white';
    protected $border = 'flat';
    protected $html = true;
    protected $service;
    protected $height = '100%';
    protected $images = 'tree';
    protected $padding = 4;
    protected $tabindex = 0;
    protected $width = '100%';
    protected $skin = false;

    /** @ignore */
    protected $_prepend = '';
    /** @ignore */
    protected $_nodes_only = false;
    /** @ignore */
    protected $_node_id = false;
    /** @ignore */
    public $_selected = null;
    /** @ignore */
    public $_client_ref;

    protected $_accept = array('treenode');
    protected $_events = array('onaction', 'onbeforeload', 'onbeforeselect', 'onblur', 'oncollapse', 'onexpand', 'onfocus', 'oncontentloading', 'oncontextmenu', 'onremove', 'onselect', 'onunselect');
    protected $_params = array('autoexpand', 'collapse', 'padding', 'bgcolor', 'html', 'images', 'width', 'height', 'service', 'tabindex', 'border', 'skin', '_nodes_only');
    protected $_scripts = array('tree', 'treenode');
    protected $_styles = array('tree');
    protected $_validate = array('collapse' => 'bool');

    /**
     *
     */
    public function load_nodes ($tree_id, $tree_node_id, $tree_node_path)
    {
        $this->_nodes_only = true;
        $this->id = $tree_id;
        $this->_node_id = $tree_node_id;
        $this->_prepend = $this->_create_prepend($tree_node_path);
    }

    /**
     *
     */
    protected function _create_prepend($prependstates)
    {
        $prepend_string = "";
        $prepend_array = explode(',', $prependstates);

        for ($i=0; $i<count($prepend_array); $i++)
        {
            $state = $prepend_array[$i];
            if ($state) {
                $img = $this->create('image', array('src' => $this->images . '/' . ($skin ? ($state == 1 ? 'line' : 'linebottom') : 'blank') . '.gif'), array(), false, true);
                $prepend_string .= $img->toHTML();
                $img->destroy();
            }
        }
        return $prepend_string;
    }

    /**
     *
     */
    protected function _toHTML()
    {
        if ($this->service && $this->engine && $this->engine->app_id)
            $this->service = $this->engine->app_id . '.' . $this->service;

        if (!$this->_nodes_only)
        {
            $this->_client_ref = $this->client->init('OK_Object_Tree', $this->id, $this->tabindex, $this->autoexpand, $this->service, $this->collapse);
            $this->process_events($this->_client_ref);
        }

        $html = '';
        $len = $this->content->length;
        for ($i = 0; $i < $len; $i++)
        {
            $item = $this->content->get($i);
            $item->root = $this;

            if ($this->_nodes_only)
            {
                $item->_nodes_only = $this->_nodes_only;

                $item->parent = new stdClass;
                $item->parent->_type = 'treenode';
                $item->parent->id = $this->_node_id;
                $item->parent->parent = $this;
                $item->parent->_client_ref = $this->client->get($this->_node_id);

                $item->_prepend = $this->_prepend;
            }

            $item->_index = $i+1;
            $item->_max = $len;
            $html .= $item->toHTML();
            $item->destroy();
        }

        if ($this->_nodes_only)
        {
            if ($len == 0 && $this->html) {
                $this->client->execute("ok.$('$this->_node_id:nav').src = '". $this->ok->images->get_image_href($this->images . '/blank.gif', '.')  ."'");
            };
//          else
//          $this->client->execute("ok.get('$this->_node_id')._oncontentloaded();");

            $this->ok->response->target = $this->_node_id;
            $this->ok->response->method = OK::LAYOUT_INSERT_AFTER;

            return $html;
        }
        elseif ($this->html)
        {
            $return = $this->create('panel', array(
                'id' => $this->id,
                'border' => $this->border,
                'bgcolor' => $this->bgcolor,
                'height' => $this->height,
                'width' => $this->width
            ), array(
                $this->create('scrollbox', array(
                    'id' => $this->id . ':BOX',
                    'bgcolor' => $this->bgcolor,
                    'width' => $this->width,
                    'height' => $this->height,
                    'padding' => $this->padding,
                    'tabindex' => -1
                ), array (
                    $html
                ))
            ));

            $output = $return->toHTML();

            return $output;
        }
        else
        {
            return "";
        }

        trigger_error("Error generating tree.", E_USER_ERROR);
    }
}
