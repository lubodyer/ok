<?php
/**
 * This file contains GroupBox OK Object
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
 * GroupBox - OK Object
 *
 * The GroupBox displays a frame around its children with an optional caption.
 *
 * @package Objects
 * @subpackage Interface
 */
class OK_Object_GroupBox extends OK_Object
{
    /**
     * Sets or retreives the padding between the object and the content.
     * @var int
     */
    protected $padding = 0;

    /**
     * Sets or retrieves the width of the object.
     * @var length
     */
    protected $width = '100%';

    /**
     * Sets or retrieves the height of the object.
     * @var length
     */
    protected $height = '100%';

    /**
     * Sets or retrieves the vertical alignment of the content of the object.
     * @var string
     */
    protected $valign = 'top';

    /**
     * Sets or retrieves the horizontal alignment of the content of the object.
     * @var string
     */
    protected $align = 'left';

    protected $style;

    /**
     * Sets or retrieves the class name of the object.
     * @var string
     */
    protected $class = "OK_GROUPBOX";

    /**
     * Sets or retrieves the title of the object.
     * @var string
     */
    public $title = "";

    protected $_params = array('title', 'orientation', 'padding', 'margin', 'width', 'height', 'align', 'valign', 'class', 'style');
    protected $_styles = array('groupbox');
    protected $_objects = array('style' => 'OK_Style');

    protected function _toHTML()
    {
        $image = $this->create('image', array('src' => 'blank.gif', 'width' => 1, 'height' => 1), null, true)->toHTML();

        $th = $this->create('table', array(
            'id'            => $this->id,
            'width'         => '100%',
            'height'        => '100%',
            'border'        => '0',
            'cellspacing'   => '0',
            'cellpadding'   => 0,
            'class'         => $this->class . '_HEADER'
        ));

        $th->setCellAttribute(1, 2, "rowspan", 2);

        $th->setCellAttribute(1, 1, "height", "6");
        $th->setCellAttribute(2, 1, "height", "6");
        $th->setCellAttribute(1, 1, "style", "width: 10px;line-height:1px;");
        $th->setCellAttribute(1, 3, "style", "line-height:1px;");
        $th->setCellAttribute(1, 2, "class", $this->class . "_TITLE");
        $th->setCellAttribute(2, 1, "class", $this->class . "_TOP_LEFT");
        $th->setCellAttribute(2, 2, "class", $this->class . "_TOP_RIGHT");

        $th->setCellContent(1, 1, $image);
        $th->setCellContent(1, 2, "&nbsp;&nbsp;$this->title&nbsp;&nbsp;");
        $th->setCellContent(1, 3, $image);
        $th->setCellContent(2, 1, $image);
        $th->setCellContent(2, 2, $image);

        // --

        $t = $this->create("table", array(
            'id' => $this->id,
            'width' => $this->width,
            'height' => $this->height,
            'style' => $this->style,
            'border' => '0',
            'cellspacing' => '0',
            'cellpadding' => 0
        ));

        $t->SetCellContent(1, 1, $th);
        $t->SetCellAttribute(1, 1, "height", "12");
        $t->SetCellAttribute(2, 1, "class", $this->class . "_BOTTOM");

        $t1 = $this->create("table");
        $t1->SetTableAttributes(array('width' => '100%', 'height' => '100%', 'border' => '0', 'cellspacing' => '0', 'cellpadding' => 0));
        $t1->SetCellAttribute(1, 1, "align", $this->align);
        $t1->SetCellAttribute(1, 1, "valign", $this->valign);
        $t1->SetCellAttribute(1, 1, "style", "padding: ".$this->padding."px;");
        $t1->SetCellContent(1, 1, $this->content);

        $t->SetCellContent(2, 1, $t1);

        return $t->toHTML();
    }

}
