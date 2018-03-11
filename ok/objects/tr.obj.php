<?php
/**
 * This file contains the TR OK Object.
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
 * TR - OK Object
 *
 * @package Objects
 * @subpackage HTML
 */
class OK_Object_TR extends OK_Object
{
    /**
     * Retrieves the string identifying the type of the object.
     * @var string
     */
    protected $_type = "tr";

    /**
     * Sets or retrieves the horizontal alignment of the content of the object.
     * @var string
     */
    protected $align;

    /**
     * Sets or retrieves the CSS class of the object.
     * @var string
     */
    protected $class;

    /**
     * Sets or retrieves the additional style declarations of the object.
     * @var string
     */
    protected $style;

    /**
     * Sets or retrieves the vertical alignment of the content of the object.
     * @var string
     */
    protected $valign;

    /**#@+
     * @access private
     */

    protected $_accept = array('td');
    protected $_childof = array('table');
    protected $_objects = array('style' => 'OK_Style');
    protected $_params = array('align', 'class', 'style', 'valign');
    protected $_validate = array(
        'align'         => array('left', 'right', 'center'),
        'class'         => 'string',
        'style'         => 'string',
        'valign'        => array('top', 'middle', 'bottom')
    );

    protected function _toHTML()
    {
        $output = array();

        $output[] = '<tr id="';
        $output[] = $this->id;
        $output[] = '"';

        if ($this->align) {
            $output[] = ' align="';
            $output[] = $this->align;
            $output[] = '"';
        }
        if ($this->class) {
            $output[] = ' class="';
            $output[] = $this->class;
            $output[] = '"';
        }
        if ($this->valign) {
            $output[] = ' valign="';
            $output[] = $this->valign;
            $output[] = '"';
        }

        if (!$this->style->isEmpty()) {
            $output[] = ' style="';
            $output[] = $this->style->toString();
            $output[] = '"';
        }

        $output[] = '>';
        $output[] = $this->content->toHTML();
        $output[] = '</tr>';

        // --

        return implode($output);
    }

    /**#@-*/
}
