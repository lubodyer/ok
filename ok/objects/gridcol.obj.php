<?php
/**
 * This file contains GridCol OK Object.
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
 * GridCol - OK Object
 *
 * Defines the properties and the behaviour of a column in a {@link OK_Object_Grid}. Must be
 * a child of a {@link OK_Object_GridHeader} object. Note that the width of the grid columns
 * is currently limited to integer values specifying the width in pixels.
 *
 * @package Objects
 * @subpackage Input
 */
class OK_Object_GridCol extends OK_Object
{
    /** */
    protected $_type = 'gridcol';

    /**
     * Sets or retrieves the width of the object in pixels.
     * @var int
     * @iname width-gridcol
     * @todo Allow star and percentage sizing of grid columns.
     */
    protected $width = 100;

    /**
     * Sets or retrieves the title of the grid column.
     * @var string
     * @iname title-gridcol
     */
    protected $title = '';

    /**
     * Sets or retrieves the horizontal alignment of the content of the object.
     * @var string
     */
    protected $align = 'left';

    /**
     *
     */
    protected $sort = true;

    /**
     *
     */
    protected $filter = true;

    /**
     *
     */
    protected $padding = null;

    /**
     * Sets or retrieves the custom style declarations for the object.
     * @var string
     */
    protected $style;

    protected $_accept = array('label', 'image', 'panel');
    protected $_objects = array('style' => 'OK_Style');
    protected $_params = array('align', 'title', 'width', 'sort', 'filter', 'style', 'padding');

    protected function _toHTML()
    {
        $this->client->call($this->client->get($this->parent->parent->id), 'addcol', $this->client->init('OK_Object_GridCol', $this->title, $this->width, $this->align, $this->sort, $this->filter, $this->padding, $this->style->toString()));
        return '';
    }

}
