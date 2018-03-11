<?php
/**
 * This file contains the TextArea OK Object.
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
 * TextArea - OK Object
 *
 * @package Objects
 * @subpackage HTML
 */
class OK_Object_TextArea extends OK_Object
{
    protected $_type = 'select';

    protected $name;
    protected $class = "OK_TEXTAREA";
    protected $style;
    protected $disabled = false;
    protected $tabindex = 0;

    protected $_params = array('class', 'name', 'style', 'disabled', 'tabindex');
    protected $_scripts = array('textarea');
    protected $_styles = array('textarea');

    protected function _toHTML()
    {
        $ref = $this->client->init('OK_Object_TextArea', $this->id, $this->tabindex);
        $this->process_events($ref);

        $output = "<textarea onfocus='ok.get(this.id).focus();' id='$this->id'";
        if ($this->class) $output .= " class='$this->class'";
        if ($this->style) $output .= " style='$this->style'";
        if ($this->disabled) $output .= ' disabled';
        $output .= '>';
        $output .= $this->content->toHTML();
        $output .= '</textarea>';

        return $output;
    }
}

