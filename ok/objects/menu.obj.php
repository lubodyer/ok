<?php
/**
 * This file contains the Menu OK Object.
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

/** Manu object extends the Element object. Include the Element object, if not already available. */
if (!class_exists('OK_Object_Element'))
    require_once(dirname(__FILE__) . '/element.obj.php');

/**
 * Menu - OK Object
 *
 * @package Objects
 * @subpackage Input
 */
class OK_Object_Menu extends OK_Object_Element
{
    protected $_type = 'menu';

    protected $class = 'MENU';
    protected $width = "";
    protected $height = "";
    protected $minwidth = "200";
    protected $minheight = "40";

    protected $extend = false;
    protected $expand = false;
    protected $_events = array('onhide', 'onbeforeshow', 'onshow');
    protected $_params = array('height', 'width', 'style');
    protected $_scripts = array('menu', 'menuitem');
    protected $_styles = array('menu');

    protected function _toHTML()
    {
        if ($this->width && !$this->style->width) {
            $this->style->width = $this->width;
        }
        if ($this->minwidth && !$this->style->{'min-width'}) {
            $this->style->{'min-width'} = $this->minwidth;
        }
        if ($this->height && !$this->style->height) {
            $this->style->height = $this->height;
        }
        if ($this->minheight && !$this->style->{'min-height'}) {
            $this->style->{'min-height'} = $this->minheight;
        }

        $menu_ref = $this->client->init('OK_Object_Menu', $this->id);

        if ($this->parent && $this->parent->_type == "menuitem") {
            $this->client->call($this->client->get($this->parent->id), 'add', $this->id);
        }

        $this->process_events($menu_ref);

        return parent::_toHTML();
    }
}
