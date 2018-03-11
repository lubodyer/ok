<?php
/**
 * This file contains the Select OK Object.
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
 * Select - OK Object
 *
 * @package Objects
 * @subpackage HTML
 */
class OK_Object_Select extends OK_Object
{
    protected $_type = 'select';

    protected $name;
    protected $class;
    protected $style;
    protected $disabled = false;
    protected $tabindex = 0;
    protected $width = "auto";
    protected $height = "auto";

    protected $_events = array('onchange');
    protected $_params = array('class', 'name', 'style', 'disabled', 'tabindex', 'width', 'height');
    protected $_accept = array('option');
    protected $_objects = array('style' => 'OK_Style');
    protected $_scripts = array('select');

    public function selectValue($value) {
        for ($i = 0; $i < $this->content->length; $i++) {
            $o = $this->content->get($i);
            if ($o->value == $value) {
                $o->selected = true;
            }
        }
    }

    protected function _toHTML()
    {
        $ref = $this->client->init('OK_Object_Select', $this->id, $this->tabindex);
        $this->process_events($ref);

        // --

        if ($this->width && !$this->style->width) {
            $this->style->width = $this->width;
        }
        if ($this->height && !$this->style->height) {
            $this->style->height = $this->height;
        }

        // --

        $output = "<select onfocus='ok.get(this.id).focus();' id='$this->id'";
        if ($this->class) $output .= " class='$this->class'";
        $output .= " style='" . $this->style->toString() . "'";
        if ($this->disabled) $output .= ' disabled';
        $output .= '>';
        $output .= $this->content->toHTML();
        $output .= '</select>';

        return $output;
    }
}

