<?php
/**
 * This file contains the Split OK Object.
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
 */

/**
 * Split - OK Object.
 *
 * This object splits its visual area in two using a verticall or horizontall bar and lies its
 * children accordingly. One of the areas is defined as a {@link $lead leading} area.
 *
 * The Split object accepts and requires exactly 2 children of any type.
 *
 * @package Objects
 * @subpackage Interface
 */
class OK_Object_Split extends OK_Object
{
    /**
     * Retrieves the string identifying the object type.
     * @var string
     */
    protected $_type = 'split';

    /**
     * Sets or retrieves the class name of the split object.
     * @var string
     */
    protected $class = 'OK_SPLIT';

    /**
     * Sets or retrieve the class name of the split bar.
     * @var string
     */
    protected $barclass = 'OK_PANEL';

    /**
     * Sets or retrieves the color of the background of the bar object.
     * @var string
     */
    protected $barcolor;

    /**
     * Sets or retrieves the size (the width or the height) of the split bar.
     * @var int
     */
    protected $barsize = 6;

    /**
     * Sets or retrieves the background color of the object.
     * @var string
     */
    protected $bgcolor;

    /**
     * Sets or retrieves the type of the border of the {@link $bar} object.
     * @var string
     */
    protected $barborder = 'flat';

    /**
     * Sets or retrieves the state of the object.
     * @var string
     */
    protected $state = 'default';

    /**
     * Sets or retrieves the location of the leading area.
     *
     * String that specifies or receives one of the following values: "left", "right", "top" or "bottom".
     *
     * @var string
     */
    protected $lead = "left";

    /**
     * Sets or retrieves the size of the leading child.
     *
     * Depending on the value of the {@link $lead} property the size is the width or the height
     * of the leading area.
     *
     * @var int
     */
    protected $size = 200;

    /**
     * Sets or retrieves the minimum {@link $size} of the leading area.
     * @var int
     */
    protected $min = 20;

    /**
     * Sets or retrieves the maximum size of the leading area.
     * @var int
     */
    protected $max = 0;

    /**
     * Sets or retrieves the margin between the object and its parent.
     * @var int
     */
    protected $margin = 0;

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
     * Retrieves a reference to the split bar object.
     *
     * The split bar is a {@link OK_Object_Panel} object.
     *
     * @var OK_Object_Panel
     * @readonly
     */
    protected $bar;

    protected $_events = array('onbeforecancel', 'onbeforeclose', 'onbeforeload', 'onbeforeopen', 'onbeforeresize', 'onbeforetoggle', 'onclose', 'onload', 'onopen', 'ontoggle', 'onunload', 'onresize');
    protected $_maxchildren = 2;
    protected $_minchildren = 2;
    protected $_objects = array('style' => 'OK_Style');
    protected $_params = array('class', 'barcolor', 'barsize', 'barborder', 'bgcolor', 'state', 'lead', 'size', 'min', 'max', 'margin', 'width', 'height');
    protected $_readonly = array('bar');
    protected $_scripts = array('split');
    protected $_styles = array('split');
    protected $_validate = array(
        'lead'          => array('left', 'right', 'top', 'bottom'),
        'state'         => array('default', 'closed', 'expanded'),
        'size'          => 'int',
        'closed'        => 'bool'
    );

    /**
     *
     *
     */
    protected function onbeforeload()
    {
        $this->bar = $this->create('panel');
        $this->bar->expand = true;
        $this->barcolor = $this->config->colors->threedface;
    }

    /**
     *
     *
     */
    protected function onunload()
    {
        $this->bar->destroy();
    }

    /**
     *
     *
     */
    protected function _toHTML()
    {
        $this->bar->id = $this->id . ':HANDLE';
        $this->bar->class = $this->barclass;
        $this->bar->bgcolor = $this->barcolor;
        $this->bar->border = $this->barborder;
        $this->bar->style->set('font-size', '0px');
        $this->bar->istyle->set('font-size', '0px');
        $this->bar->width = '100%';
        $this->bar->height = '100%';
//      $this->bar->style->cursor = $this->lead == 'left' || $this->lead == 'right' ? 'e-resize' : 'n-resize';
//      $this->bar->istyle->cursor = $this->lead == 'left' || $this->lead == 'right' ? 'e-resize' : 'n-resize';

        // ---

        if ($this->bgcolor)
            $this->style->set('background-color', $this->bgcolor);
        if ($this->margin)
            $this->style->margin = $this->margin;
        if ($this->width)
            $this->style->width = $this->width;
        if ($this->height)
            $this->style->height = $this->height;

        // ---

        $split = $this->create('div', array(
            'id' => $this->id,
            'class' => $this->class,
            'style' => $this->style,
            'nochildrenresize' => 1
        ), array(
            $this->create('div', array(
                'id' => $this->id . ':1',
                'class' => $this->class . '_PANE',
                'style' => 'display: none'
                ), $this->content->itemToHTML(0)
            ), $this->create('div', array(
                'id' => $this->id . ':BAR',
                'class' => $this->class . '_BAR',
                'style' => 'display: none'
            ), $this->bar->toHTML()
            ), $this->create('div', array(
                'id' => $this->id . ':2',
                'class' => $this->class . '_PANE',
                'style' => 'display: none'
            ), $this->content->itemToHTML(1))
        ));

        $ref = $this->client->init('OK_Object_Split', $this->id, $this->lead, $this->size, $this->min, $this->max, $this->barsize, $this->state);
        $this->process_events($ref);

        return $split->toHTML();
    }

}
