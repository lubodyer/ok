<?php
/**
 * This file contains the TD OK Object.
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
 * TD - OK Object
 *
 * @package Objects
 * @subpackage HTML
 */
class OK_Object_TD extends OK_Object
{
    /**
     * Retrieves
     *  the string identifying the type of the Object.
     * @var string
     */
    protected $_type = "td";

    /**
     * Sets or retrieves the horizontal alignment of the content of the object.
     * @var string
     */
    protected $align;

    /**
     * Sets or retrieves the background color of the object.
     * @var string
     */
    protected $bgcolor;

    /**
     * Sets or retrieves the CSS class of the object.
     * @var string
     */
    protected $class;

    /**
     * Sets the number of columns a cell should span.
     * @var int
     */
    protected $colspan;

    /**
     * Sets or retrieves the height of the object.
     * @var mixed
     */
    protected $height;

    /**
     * Sets the number of rows a cell should span.
     * @var int
     */
    protected $rowspan;

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

    /**
     * Sets or retrieves the width of the object.
     * @var mixed
     */
    protected $width;

    /**#@+
     * @access private
     */

    protected $_childof = array('tr');
    protected $_objects = array('style' => 'OK_Style');
    protected $_params = array('align', 'bgcolor', 'class', 'colspan', 'height', 'rowspan', 'style', 'valign', 'width');
    protected $_validate = array(
        'align'         => array('', 'left', 'right', 'center'),
        'bgcolor'       => 'string',
        'class'         => 'string',
        'colspan'       => 'int',
        'height'        => 'length',
        'rowspan'       => 'int',
        'style'         => 'string',
        'valign'        => array('', 'top', 'middle', 'bottom'),
        'width'         => 'length'
    );

    protected function _toHTML()
    {
        if ($this->bgcolor) {
            $this->style->set('background-color', $this->bgcolor);
        }
        if ($this->height) {
            $this->style->height = $this->height;
        }

        // --

        $output = array();

        $output[] = '<td id="';
        $output[] = $this->id;
        $output[] = '"';

        if ($this->width) {
            $output[] = ' width="';
            $output[] = $this->width;
            $output[] = '"';
        }
//      if ($this->height) {
//          $output[] = ' height="';
//          $output[] = $this->height;
//          $output[] = '"';
//      }
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
        if ($this->colspan) {
            $output[] = ' colspan="';
            $output[] = $this->colspan;
            $output[] = '"';
        }
        if ($this->rowspan) {
            $output[] = ' rowspan="';
            $output[] = $this->rowspan;
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
        $output[] = '</td>';

        // --

        return implode($output);
    }

    /**#@-*/
}
