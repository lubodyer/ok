<?php
/**
 * This file contains the MenuItem OK Object.
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
 * MenuItem - OK Object
 *
 * @package Objects
 * @subpackage Input
 */
class OK_Object_MenuItem extends OK_Object
{
    protected $_type = 'menuitem';

    /**
     * @todo Implement accesskey attribute.
     * @ignore
     */
    protected $accesskey;

    protected $icon = 'blank.gif';
    protected $label;
    protected $shortcut;

    protected $disabled = false;

    protected $width = '100%';
    protected $height = 30;
    protected $padding = 8;
    protected $style;

    protected $_app_id;
    protected $_accept = array('menu');
    protected $_childof = array('menu');
    protected $_events = array('onaction', 'onmousedown', 'onmouseup', 'onmousedown');
    protected $_objects = array('style' => 'OK_Style');
    protected $_params = array('accesskey', 'icon', 'label', 'shortcut', 'width', 'height', 'border', 'padding', 'disabled', 'style');
    protected $_validate = array(
        'shortcut' => 'string',
        'width' => 'length',
        'disabled' => 'bool'
    );

    protected function onbeforeload()
    {
        if ($this->engine) {
            $this->_app_id = $this->engine->app_id;
        }
    }

    /**
     * Sets the label of the menu item.
     *
     * @iname write_menuitem
     */
    public function write($text)
    {
        $this->label = $text;
    }

    protected function _toHTML()
    {
        $tClassName = 'MENUITEM';
        if ($this->disabled) {
            $tClassName .= '_DISABLED';
        }

        // --
        
        $len = $this->content->length;
        for ($i=0; $i<$len; $i++) 
        {
            $item = $this->content->get($i);
            if (!($item instanceOf OK_Object_MenuItem)) {
                $this->label .= $this->content->itemToHTML($i);
                $this->content->remove($i);
                $i--; $len--;
            }
        }
        
        // --

        $output = array();

        $output[] = '<table id="';
        $output[] = $this->id;
        $output[] = '" class="';
        $output[] = $tClassName;
        $output[] = '" width="';
        $output[] = $this->width;
        $output[] = '" height="';
        $output[] = $this->height;
        $output[] = '" cellspacing="0" cellpadding="1"><tr><td width="16" valign="middle" style="line-height:0;">';

        if ($this->icon == 'blank.gif') {
            $img = $this->create('image', array('id' => $this->id . '_img', 'src' => $this->icon, 'width' => 16, 'height' => 16));
        } else {
            $img = $this->create('image', array('id' => $this->id . '_img', 'app_id' => $this->_app_id, 'src' => $this->icon));
        }

        $output[] = $img->toHTML();
        $output[] = '</td><td id="';
        $output[] = $this->id;
        $output[] = ':label" valign="middle" align="left" style="white-space: nowrap;';
        $output[] = $this->style->toString();
        $output[] = '">';
        $output[] = $this->label;
        $output[] = '</td>';

        if ($this->shortcut) {
            $output[] = '<td align="right" style="white-space: nowrap;">';
            $output[] = $this->shortcut;
            $output[] = '</td>';
        }

        $output[] = '<td width="12" align="right" valign="middle">';
        if ($this->content->length) {
            $output[] = $this->create('image', array('src' => 'right.gif'))->toHTML();
        } else {
            $output[] = '&#160;';
        }
        $output[] = '</td>';

        $output[] = '</tr></table>';

        // --

        $ref = $this->client->init('OK_Object_MenuItem', $this->id);
        $this->process_events($ref);

        if ($this->disabled) {
            $this->client->set($ref, 'enabled', 0);
        }
        $this->client->execute("ok.get('".$this->parent->id."').add($ref);");

        // --

        if ($this->content->length) {
            $output[] = $this->content->toHTML();
        }

        // --

        return implode($output);
    }
}
