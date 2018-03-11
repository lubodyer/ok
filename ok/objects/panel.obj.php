<?php
/**
 * This file contains the Panel OK Object.
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
 * Panel - OK Object
 *
 * Use the Panel to group collections of Objects in order to separate the elements of the
 * user interface. The Panel object is displayed by default without any borders. You can display
 * a border to distinguish the area of the panel from the other elements of the user interface
 * by specifying one of the values supported by the {@link $border} property.
 *
 * The Panel object does not display a caption. If you need to display a caption use the
 * {@link OK_Object_GroupBox} object.
 *
 * The Panel object does not allow scrolling. If you need to implement scrolling, add a
 * {@link OK_Object_ScrollBox} as its child.
 *
 * @package Objects
 * @subpackage Interface
 */
class OK_Object_Panel extends OK_Object
{
    /**
     * Retrieves the string identifying the object type.
     * @var string
     */
    protected $_type = 'panel';

    /**
     * Sets or retrieves the horizontal alignment of the content of the object.
     * @var string
     */
    protected $align;

    /**
     *
     * @var string
     * @access protected
     */
    protected $app_id;

    /**
     * Sets or retrieves the background color of the object.
     * @var string
     */
    protected $bgcolor;

    /**
     * Sets or retrieves the type of the border of the object.
     * @var string
     */
    protected $border = 'flat';

    /**
     * Sets or retrieves the class name of the object.
     * @var string
     */
    protected $class = 'OK_PANEL';

    /**
     * Sets or retrieves the type of the element used to generate the object.
     * @var string
     */
    protected $element = 'auto';

    /**
     * Sets or retrieves whether or not the object to try to take as less space as possible instead of as much as possible.
     * @var boolean
     */
    protected $expand = true;

    /**
     * Sets or retrieves the height of the object.
     * @var string
     */
    protected $height = '100%';

    /**
     * Sets or retrieves the inner style of the object.
     * @var string
     */
    protected $istyle;

    /**
     * Sets or retrieves the layout orientation.
     *
     * Possible values are 'vertical' and 'horizontal'.
     *
     * Horizontal layout engine places objects next to each other in a row. Vertical engine places them under each other in a column.
     *
     * @var string
     */
    protected $orientation = 'vertical';

    /**
     *
     *
     */
    protected $overflow = '';

    /**
     * Sets or retrieves whether or not the object to try to take as less space as possible instead of as much as possible.
     * @var boolean
     */
    protected $pack = false;

    /**
     * Sets or retrieves the padding between the content and the object.
     * @var integer
     */
    protected $padding = 0;

    /**
     * Sets or retrieves the custom style declarations of the object.
     * @var string
     */
    protected $style;

    /**
     * Sets or retrieves the vertical alignment of the content of the object.
     * @var string
     */
    protected $valign = 'top';

    /**
     *
     * @var string
     */
    protected $value;

    /**
     * Sets or retrieves the width of the object.
     * @var string
     */
    protected $width = '100%';

    /**#@+
     * Object configuration settings.
     * @access private
     */

    protected $_params = array('align', 'bgcolor', 'border', 'class', 'element', 'expand', 'height', 'istyle', 'orientation', 'pack', 'padding', 'style', 'valign', 'value', 'width');
    protected $_objects = array('style' => 'OK_Style', 'istyle' => 'OK_Style');
    protected $_styles = array('panel');
    protected $_validate = array(
        'align'             => array('', 'left', 'right', 'center'),
        'bgcolor'           => 'string',
        'border'            => 'string',
        'class'             => 'string',
        'element'           => array('auto', 'div', 'table'),
        'expand'            => 'bool',
        'height'            => 'length',
        'istyle'            => 'string',
        'orientation'       => array('horizontal', 'vertical'),
        'overflow'          => array('', 'visible', 'scroll', 'hidden', 'auto', 'inherit'),
        'pack'              => 'bool',
        'padding'           => 'int',
        'style'             => 'string',
        'tabindex'          => 'int',
        'valign'            => array('', 'top', 'middle', 'bottom'),
        'value'             => 'string',
        'width'             => 'length'
    );

    protected function onbeforeload()
    {
//      $this->bgcolor = $this->config->colors->threedface;

        if ($this->engine)
            $this->app_id = $this->engine->app_id;
    }

    /**#@-*/

    /**
     * Retreieves the output of the object.
     * @return string
     */
    protected function _toHTML()
    {
        if ($this->value) {
            $this->content->write($this->value);
        }
        if (!$this->content->length) {
            $this->content->write('&#160;');
        }
        if ($this->pack && $this->width == '100%') {
            $this->width = '';
        }
        if ($this->pack && $this->height == '100%') {
            $this->height = '';
        }
        if ($this->width) {
            $this->style->width = $this->width;
        }
        if ($this->height) {
            $this->style->height = $this->height;
        }

        // --

        $class_out  = $this->class.'_'.strtoupper($this->border).'_OUT';
        $class_in   = $this->class.'_'.strtoupper($this->border).'_IN';

        // --

        if ($this->element == 'auto') {
            if ($this->valign == "middle" || $this->valign == "bottom") {
                $this->element = "table";
            } else {
                $this->element = "div";
            }
        }

        // --

        if ($this->element == 'table')
        {
            if ($this->bgcolor) {
                $this->istyle->set('background-color', $this->bgcolor);
            }

            $output = array();

            $output[] = '<table id="';
            $output[] = $this->id;
            $output[] = '_table" class="';
            $output[] = $class_out;
            $output[] = '" cellspacing="0" cellpadding="';
            $output[] = $this->padding;
            $output[] = '" style="';
            $output[] = $this->style->toString();
            $output[] = '"><tr><td id="';
            $output[] = $this->id;
            $output[] = '" class="';
            $output[] = $class_in;
            $output[] = '" align="';
            $output[] = $this->align;
            $output[] = '" valign="';
            $output[] = $this->valign;
            $output[] = '" style="';
            $output[] = $this->istyle->toString();
            $output[] = '">';
            $output[] = $this->content->toHTML();
            $output[] = '</td></tr></table>';

            return implode($output);
        }
        else
        {
            if ($this->overflow) {
                $this->style->overflow = $this->overflow;
            }
            if ($this->padding) {
                $this->style->padding = $this->padding;
            }
            if ($this->align) {
                $this->style->set('align', $this->align);
            }
            if ($this->bgcolor) {
                $this->style->set('background-color', $this->bgcolor);
            }

            // --

            $output = array();

            $output[] = '<div id="';
            $output[] = $this->id;
            $output[] = '" align="';
            $output[] = $this->align;
            $output[] = '" class="';
            $output[] = $class_out;
            $output[] = '" style="';
            $output[] = $this->style->toString();
            $output[] = '">';
            $output[] = $this->content->toHTML();
            $output[] = '</div>';

            return implode($output);
        }
    }

}

