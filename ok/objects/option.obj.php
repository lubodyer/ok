<?php
/**
 * This file contains the Option OK Object.
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
 * @subpackage HTML
 */

/**
 * Option - OK Object
 *
 * @package Objects
 * @subpackage HTML
 */
class OK_Object_Option extends OK_Object
{
    public $_type = 'option';

    public $value;
    public $class;
    public $style;
    public $selected = false;
    public $disabled = false;

    protected $_params = array('id', 'value', 'class', 'style', 'selected', 'disabled');

    protected function _toHTML()
    {
        $output = "<option id='$this->id'";
        if ($this->class) $output .= " class='$this->class'";
        if ($this->style) $output .= " style='$this->style'";
        if (!is_null($this->value)) $output .= " value='$this->value'";
        if ($this->selected) $output .= ' selected';
        if ($this->disabled) $output .= ' disabled';
        $output .= '>';
        $output .= $this->content->toHTML();
        $output .= '</option>';

        return $output;
    }
}
