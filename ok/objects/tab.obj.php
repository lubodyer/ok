<?php
/**
 * This file contains the Tab OK Object.
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
 * @subpackage Interface
 */

/**
 * Tab - OK Object
 *
 * @package Objects
 * @subpackage Interface
 */
class OK_Object_Tab extends OK_Object
{
    protected $_type = 'tab';

    protected $icon;
    protected $disabled = false;
    protected $label = "";
    protected $service;
    protected $class;
    
    protected $app_id;
    protected $_params = array('class', 'disabled', 'icon', 'label', 'service');
    
    protected function onbeforeload()
    {
        if ($this->engine) {
            $this->app_id = $this->engine->app_id;
        }
    }

    protected function _toHTML()
    {
        if ($this->icon) {
            $this->label = $this->create('image', array(
                'src' => $this->icon,
                'app_id' => $this->app_id
            ))->toHTML() . $this->label;
        }
        
        if ($this->content->length) {
            $this->label .= $this->content->toHTML();
        }
        
        return $this->label;
    }

}

