<?php
/**
 * This file contains the Input OK Object.
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
 * Input - OK Object
 *
 * @package Objects
 * @subpackage Input
 */
class OK_Object_Input extends OK_Object
{
    protected $_type = 'input';

    protected $type = "text";
    protected $name;
    protected $class;
    protected $style;
    protected $disabled = false;
    protected $tabindex = 0;
    protected $value = "";
    protected $autocomplete = "new-password";
    protected $autocorrect = "off";
    protected $autocapitalize = "off";
    protected $pattern = "";
    protected $novalidate = false;
    protected $placeholder;
    protected $width = "100%";
    protected $height = "auto";
    protected $select = false;
    protected $title = "";

    protected $_accept = array();
    protected $_events = array('onchange', 'onfocus', 'onblur');
    protected $_params = array('class', 'name', 'style', 'disabled', 'tabindex', 'value', 'type', 'novalidate', 'autocorrect', 'autocapitalize', 'pattern', 'placeholder', 'width', 'height', 'select', 'title', 'autocomplete');
    protected $_objects = array('style' => 'OK_Style');
    protected $_scripts = array('input');

    protected function _toHTML()
    {
        $ref = $this->client->init('OK_Object_Input', $this->id, $this->tabindex);
        $this->process_events($ref);

        if ($this->width && !$this->style->width) {
            $this->style->width = $this->width;
        };
        if ($this->height && !$this->style->height) {
            $this->style->height = $this->height;
        };

        // hack
        if ($this->title) {
            $this->placeholder = $this->title;
        }

        $output = "<input type='$this->type' onfocus='ok.get(this.id).focus();' id='{$this->id}'";
        $output .= " value='{$this->value}'";
        $output .= " autocorrect='{$this->autocorrect}'";
        $output .= " autocapitalize='{$this->autocapitalize}'";
        $output .= " autocomplete='{$this->autocomplete}'";
        if ($this->placeholder) $output .= " placeholder='{$this->placeholder}'";
        if ($this->pattern) $output .= " pattern='{$this->pattern}'";
        if ($this->class) $output .= " class='$this->class'";
        $output .= " style='" . $this->style->toString() . "'";
        if ($this->disabled) $output .= ' disabled';
        if ($this->novalidate) $output .= ' novalidate';

        $output .= '/>';

        return $output;
    }
}
