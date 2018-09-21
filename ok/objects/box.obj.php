<?php
/**
 * This file contains the Box OK Object.
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
 * Box - OK Object
 *
 * The Box object, and its descendents, the {@link OK_Object_HBox} and the
 * {@link OK_Object_VBox}, allow you to divide the visual space into series of boxes.
 * The box will orient its children horizontally or vertically depending on the value of the
 * {@link $orientation} property. A horizontal box lines up its children horizontally in a row.
 * A vertical box will place its children underneath each other in a column. The width or the
 * height of the child objects control their position and size. You can add as many children as
 * you want inside a box, including other boxes.
 *
 * @package Objects
 * @subpackage Interface
 */
class OK_Object_Box extends OK_Object
{
    /**
     * Retrieves the string identifying the object type.
     * @var string
     */
    protected $_type = 'box';

    /**
     * Sets or retrieves the horizontal alignment of the content of the object.
     * @var string
     */
    protected $align = 'left';

    /**
     * Sets or retrieves the class name of the object.
     * @var string
     */
    protected $class;

    /**
     * Sets or retrieves whether the object should take as much space as possible instead of as less as possible.
     * @var boolean
     */
    protected $expand = true;

    /**
     * Sets or retrieves the height of the object.
     * @var length
     */
    protected $height = '100%';

    /**
     * Sets or retrieves whether this object is important.
     *
     * Not important objects may decide to skip themselves and provide only output of their children.
     *
     * @access private
     * @var bool
     */
    protected $important = false;

    /**
     * Sets or retrieves the layout orientation.
     *
     * Possible values are 'vertical' and 'horizontal'.
     *
     * Horizontal layout engine places objects next to each other in a row. Vertical engine places them under each other in a column.
     *
     * @var string
     * @iname orientation-box
     */
    protected $orientation = 'horizontal';

    /**
     * Sets or retrieves whether the object should take as less space as possible instead of as much as possible.
     * @var boolean
     */
    protected $pack = false;

    /**
     * Sets or retrieves the padding between the object and its content.
     * @var int
     */
    protected $padding = 0;

    /**
     * Sets or retrieves the additional style declarations for the object.
     * @var string
     */
    protected $style;

    /**
     * Sets or retrieves the width of the object.
     * @var length
     */
    protected $width = '100%';

    /**
     * Sets or retrieves the vertical align of the content of the object.
     * @var string
     */
    protected $valign = 'middle';

    /**#@+
     * @access protected
     */

    protected $_params = array('align', 'class', 'expand', 'height', 'important', 'orientation', 'pack', 'padding', 'style', 'valign', 'width');
    protected $_objects = array('style' => 'OK_Style');
    protected $_validate = array(
        'align'         => array('left', 'right', 'center'),
        'class'         => 'string',
        'height'        => 'length',
        'important'     => 'bool',
        'orientation'   => array('horizontal', 'vertical'),
        'pack'          => 'bool',
        'style'         => 'string',
        'valign'        => array('top', 'middle', 'bottom'),
        'width'         => 'length'
    );

    /**#@-*/

    /**
     * Retreieves the output of the object.
     */
    protected function _toHTML()
    {
        $items = $this->content->length;

        if (!$items)
            return '';

        if ($items == 1 && !$this->important)
            return $this->content->toHTML();

        // --

        if ($this->width) {
            $this->style->width = $this->width;
        }
        if ($this->height) {
            $this->style->height = $this->height;
        }

        // --

        $output = array();

        $output[] = '<table id="';
        $output[] = $this->id;
        $output[] = '" cellspacing="0" cellpadding="';
        $output[] = $this->padding;
        $output[] = '" class="';
        $output[] = $this->class;
        $output[] = '" style="';
        $output[] = $this->style->toString();
        $output[] = '">';

        $dividers = array("separator" => 1, "toolbarseparator" => 1, "divider" => 1);

        if ($this->orientation == 'horizontal') {
            $output[] = '<tr>';
        }

        for ($i = 0; $i < $items; $i++)
        {
            $item = $this->content->get($i);

            $style = new OK_Style();
            $style->set("text-align", $this->align);
            $style->set("vertical-align", $this->valign);

            if ($this->orientation == "vertical")
            {
                if ((isset($item->_type) && isset($dividers[$item->_type])) || (isset($item->pack) && $item->pack)) {
                    $style->height = 1;
                } elseif (isset($item->height) && preg_match("/^[0-9]+$/", $item->height)) {
                    $style->height = $item->height;
                }

                $output[] = '<tr>';
                $output[] = '<td';
                $output[] = ' style="';
                $output[] = $style->toString();
                $output[] = '">';
                $output[] = $item->toHTML();
                $output[] = '</td></tr>';
            }
            elseif ($this->orientation == "horizontal")
            {
                $output[] = '<td';
                if ((isset($item->_type) && isset($dividers[$item->_type])) || (isset($item->pack) && $item->pack)) {
                    $style->width = 1;
                } elseif (isset($item->width) && preg_match("/^[0-9]+$/", $item->width)) {
                    $style->width = $item->width;
                }

                $output[] = ' style="';
                $output[] = $style->toString();
                $output[] = '">';
                $output[] = $item->toHTML();
                $output[] = '</td>';
            }
        }

        if ($this->orientation == 'horizontal') {
            $output[] = '</tr>';
        }
        $output[] = '</table>';

        // --

        return implode($output);
    }

}
