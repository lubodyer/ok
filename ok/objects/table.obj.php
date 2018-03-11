<?php
/**
 * This file contains the Table OK Object.
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
 * Table - OK Object
 *
 * {@link $align}
 *
 * @package Objects
 * @subpackage HTML
 */
class OK_Object_Table extends OK_Object
{
    protected $_type = 'table';

    /**
     * Sets or retrieves the horizontal alignment of the object.
     * @var string
     * @iname align-object
     */
    protected $align;

    protected $bgcolor;

    protected $border = 0;

    protected $class;

    protected $cellpadding = 0;

    protected $cellspacing = 0;

    protected $height;

    protected $style;

    protected $title;

    protected $tabno;

    protected $width;

    /**
     *
     */
    protected $noresize = 0;

    /**
     *
     */
    protected $nochildrenresize = 0;


    protected $_accept = array('tr', 'form');
    protected $_objects = array('style' => 'OK_Style');
    protected $_params = array('align', 'bgcolor', 'border', 'class', 'cellpadding', 'cellspacing', 'height', 'style', 'tabno', 'title', 'width', 'noresize', 'nochildrenresize');

    public function setCellContent($row, $col, $content)
    {
        $cell = $this->getCell($row, $col);
        $cell->add($content);
    }

    public function setCellAttribute($row, $col, $attribute, $value)
    {
        $cell = $this->getCell($row, $col);
        $cell->$attribute = $value;
    }

    public function setCellAttributes($row, $col, $array)
    {
        $cell = $this->getCell($row, $col);
        if (is_array($array))
            foreach ($array as $attribute => $value)
                $cell->$attribute = $value;
    }

    public function setRowAttribute($row, $attribute, $value)
    {
        $tr = $this->getRow($row);
        $tr->$attribute = $value;
    }

    public function setRowAttributes($row, $array)
    {
        $tr = $this->getRow($row);
        if (is_array($array))
        foreach ($array as $attribute => $value)
            $tr->$attribute = $value;
    }

    public function setTableAttributes($array)
    {
        foreach ($array as $key => $value)
            $this->setProperty($key, $value);
    }

    public function setTableAttribute($key, $value)
    {
        $this->setProperty($key, $value);
    }

    protected function getRow($row)
    {
        $rows = $this->content->length;
        if ($row > $rows)
            for ($i = $rows; $i < $row; $i++)
                $this->add($this->create('tr'));

        return $this->content->get($row-1);
    }

    public function getCell($row, $col)
    {
        $tr = $this->getRow($row);
        $cols = $tr->content->length;

        if ($col > $cols)
            for ($i = $cols; $i < $col; $i++)
                $tr->add($this->create('td'));

        return $tr->content->get($col-1);
    }

    protected function _toHTML()
    {
        if ($this->bgcolor) {
            $this->style->set('background-color', $this->bgcolor);
        }
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
        $output[] = '" cellspacing="';
        $output[] = $this->cellspacing;
        $output[] = '" cellpadding="';
        $output[] = $this->cellpadding;
        $output[] = '" align="';
        $output[] = $this->align;
        $output[] = '" class="';
        $output[] = $this->class;
        $output[] = '" title="';
        $output[] = $this->title;
        $output[] = '" style="';
        $output[] = $this->style->toString();
        $output[] = '"';

        if ($this->noresize) {
            $output[] = ' data-ok-noresize="1"';
        }
        if ($this->nochildrenresize) {
            $output[] = ' data-ok-nochildrenresize="1"';
        }

        $output[] = '>';
        $output[] = $this->content->toHTML();
        $output[] = '</table>';

        // --

        return implode($output);
    }
}
