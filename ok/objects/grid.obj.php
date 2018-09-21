<?php
/**
 * This file contains Grid OK Object.
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
 * Grid - OK Object
 *
 * Provides a flexible grid area that consists of rows and columns.
 *
 * The Grid control accepts children of type {@link OK_Object_GridHeader}, to define columns
 * and their behaviour, and {@link OK_Object_GridData}.
 *
 * @package Objects
 * @subpackage Input
 */
class OK_Object_Grid extends OK_Object
{
    /** */
    protected $_type = 'grid';

    /**
     * Sets or retrieves the class name of the object.
     * @var string
     */
    protected $class = 'OK_GRID';

    /**
     *
     */
    protected $padding = 4;

    /**
     * Sets or retrieves the index that defines the tab order for the object.
     *
     * Integer that specifies or receives one of the following values:
     *
     * - Objects with positive tab index are selected in increasing order and in source order.
     * - Objects with tab index of zero are selected in source order.
     * - Objects with negative tab index are ommited from the tabbing order.
     *
     * @var int
     */
    protected $tabindex = 0;

    /**
     * Sets or retrieves the with of the object.
     * @var length
     */
    protected $width = '100%';

    /**
     * Sets or retrieves the height of the object.
     * @var length
     */
    protected $height = '100%';

    /**
     * Sets or retrieves the height of the row in pixels.
     * @var int
     */
    protected $rowheight = 40;

    /**
     * Sets or retrieves the custom style declarations.
     * @var string
     */
    protected $style;

    /**
     * Sets or retrieves the default text to display when there are no rows.
     * @var string
     */
    protected $text = "There are no items to show in this view.";

    /**
     * Sets or retrieves whether or not to display the grid header.
     * @var boolean
     */
    protected $header = true;

    /**
     *
     */
    protected $version = 1;

    protected $selectedindex = -1;

    protected $_accept = array('gridheader', 'griddata');
    protected $_events = array('onaction', 'oncontextmenu', 'onkeydown', 'onbeforeselect', 'onselect', 'ondragover', 'ondragout', 'ondrop', 'ondragstart', 'onbeforeredraw', 'onredraw', 'onresize', 'onunselect');
    protected $_objects = array('style' => 'OK_Style');
    protected $_params = array('width', 'header', 'height', 'tabindex', 'class', 'padding', 'rowheight', 'sortable', 'sort_column', 'style', 'text', 'version', 'selectedindex');
    protected $_scripts = array('grid', 'grid2');
    protected $_styles = array('grid');
    protected $_validate = array(
        'header' => 'bool',
        'version' => 'int'
    );

    protected function _toHTML()
    {
        if ($this->version > 1) {
            $object = 'OK_Object_Grid2';
            $this->_scripts = array('grid2');
        } else {
            $object = 'OK_Object_Grid';
            $this->_scripts = array('grid');
        }

        $ref = $this->client->init($object, $this->id, $this->tabindex, $this->class, $this->header, $this->text, $this->padding, $this->rowheight, $this->selectedindex);
        $this->process_events($ref);

        // --

        if (!$this->style->width) {
            $this->style->width = $this->width;
        }
        if (!$this->style->height) {
            $this->style->height = $this->height;
        }

        $grid = $this->create('div', array(
            'id' => $this->id,
            'class' => $this->class,
            'style' => $this->style
        ));

        $grid->add($this->create('div', array(
            'id' => $this->id . ':DATA',
            'class' => $this->class . '_DATA'
        )));
        $grid->add($this->content->get(0)->toHTML());
        $grid->add($this->create('hscrollbar', array(
            'id' => $this->id . ':HSCROLL',
            'style' => "position: absolute; display: none;",
            'onscrollstart' => "ok.route(e, '{$this->id}');",
            'onscrollend' => "ok.route(e, '{$this->id}');",
            'onscroll' => "ok.route(e, '{$this->id}');"
        )));
        $grid->add($this->create('vscrollbar', array(
            'id'        => $this->id . ':VSCROLL',
            'style'     => "position: absolute; display: none;",
            'onscrollstart' => "ok.route(e, '{$this->id}');",
            'onscrollend' => "ok.route(e, '{$this->id}');",
            'onscroll' => "ok.route(e, '{$this->id}');"
        )));

        $output = $grid->toHTML();

        // --

        if ($this->content->length > 1) {
            $this->content->get(1)->toHTML();
        }

        // --

        return $output;
    }
}
