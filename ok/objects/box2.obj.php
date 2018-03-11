<?php
/**
 * This file contains the Box2 OK Object.
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
 * Box2 - OK Object
 *
 * The Box object allows you to divide the visual space into series of boxes.
 * The box will orient its children horizontally or vertically depending on the value of the
 * {@link $orientation} property. A horizontal box lines up its children horizontally in a row.
 * A vertical box will place its children underneath each other in a column. The width or the
 * height of the child objects control their position and size. You can add as many children as
 * you want inside a box, including other boxes.
 *
 * @package Objects
 * @subpackage Interface
 */
class OK_Object_Box2 extends OK_Object
{
    /**
     * Retrieves the string identifying the object type.
     * @var string
     */
    protected $_type = 'box2';

    /**
     * Sets or retrieves the horizontal alignment of the content of the object.
     * @var string
     * @iname align-box2
     */
    protected $align = 'stretch';

    /**
     * Sets or retrieves the class name of the object.
     * @var string
     */
    protected $class;

    /**
     * Sets or retrieves the height of the object.
     * @var length
     */
    protected $height = '100%';

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
     * @iname valign-box2
     */
    protected $valign = 'stretch';

    /**#@+
     * @access protected
     */

    protected $_events = array('onbeforeresize', 'onresize', 'onunload');
    protected $_params = array('align', 'class', 'height', 'orientation', 'padding', 'style', 'valign', 'width');
    protected $_objects = array('style' => 'OK_Style');
    protected $_scripts = array('box2');
    protected $_validate = array(
        'align'         => array('stretch', 'left', 'right', 'center'),
        'class'         => 'string',
        'height'        => 'length',
        'orientation'   => array('horizontal', 'vertical'),
        'style'         => 'string',
        'valign'        => array('stretch', 'top', 'middle', 'bottom'),
        'width'         => 'length'
    );

    /**#@-*/

    /**
     * Retreieves the output of the object.
     */
    protected function _toHTML()
    {
        $ref = $this->client->init('OK_Object_Box2', $this->id, $this->orientation, $this->align, $this->valign);
        $this->process_events($ref);

        $this->style->padding = $this->padding;
        $this->style->width = $this->width;
        $this->style->height = $this->height;
        $this->style->overflow = "hidden";

        if ($this->style->position != "absolute") {
            $this->style->position = "relative";
        }

        $box = $this->create('div', array(
            'id' => $this->id,
            'class' => $this->class,
            'style' => $this->style,
            'nochildrenresize' => true
        ));

        $size = $this->orientation == "horizontal" ? "width" : "height";

        for ($i = 0; $i < $this->content->length; $i++) {
            $item = $this->content->get($i);
            if ($item instanceOf OK_Object)
            {
                if ($item->_type !== "spacer") {
                    $box->add($item);
                }
                $this->client->call($ref, 'add', $item->id, $item->_type, $item->$size);
            }
        }

        return $box->toHTML();
    }

}
