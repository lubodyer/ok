<?php
/**
 * This file contains the ScrollBar OK Object.
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
 * ScrollBar - OK Object
 *
 * A scroll bar consists of a shaded shaft with an arrow button at each end and a scroll box
 * between the arrow buttons. Objects that display data larger than their visible area display
 * scroll bars to allow the user to bring into view the portions of the data that extends
 * beyond the their bounds.
 *
 * Do not use this object directly, use is descendents - the {@link OK_Object_HScrollBar}
 * and {@link OK_Object_VScrollBar}.
 *
 * @package Objects
 * @subpackage Interface
 */
class OK_Object_ScrollBar extends OK_Object
{
    /** */
    protected $_type = 'scrollbar';

    protected $orientation = 'horizontal';

    /**
     * Sets or retrieves the class name of the object.
     * @var string
     */
    protected $class = 'OK_SCROLLBAR';

    /**
     * Sets or retrieves the current value of the scroll bar.
     * @var int
     * @iname value:scrollbar
     */
    protected $value = 0;
    protected $min = 0;
    protected $max = 10;
    protected $small = 1;
    protected $large = 2;

    protected $width = 16;
    protected $height = 16;
    protected $bwidth = 16;
    protected $bheight = 16;

    protected $style;

    protected $image_up = 'up.gif';
    protected $image_down = 'down.gif';
    protected $image_left = 'left.gif';
    protected $image_right = 'right.gif';

    protected $bgcolor;

    protected $disabled = false;

    protected $_events = array('onscroll', 'onscrollstart', 'onscrollend', 'onresize');
    protected $_objects = array('style' => 'OK_Style');
    protected $_params = array('value', 'min', 'max', 'small', 'large', 'width', 'height', 'disabled', 'class', 'bgcolor', 'style');
    protected $_scripts = array('scrollbar');
    protected $_styles = array('scrollbar');
    protected $_validate = array(
        'disabled'      => 'bool',
        'width'         => 'length',
        'value'         => 'int'
    );

    private function createVScrollBar ()
    {
        if (!$this->style->position) {
            $this->style->position = "relative";
        };

        $this->style->top = 0;
        $this->style->left = 0;

        $scrollbar = $this->create('div', array(
                'id' => $this->id,
                'class' => $this->class,
                'width' => $this->width,
                'height' => '100%',
                'bgcolor' => $this->bgcolor,
                'overflow' => 'hidden',
                'style' => $this->style
            ), array(
                $this->create('button', array(
                    'id' => $this->id . ':UP',
                    'icon' => $this->image_up,
                    'disabled' => $this->disabled,
                    'class' => $this->class . '_BUTTON',
                    'width' => $this->bwidth,
                    'height' => $this->bheight,
                    'style' => 'position: relative; top: 0; left: 0;',
                    'minwidth' => '',
                    'minheight' => '',
                    'tabindex' => -1
                )),
                $this->create('div', array (
                    'id' => $this->id . ":BAR",
                    'class' => $this->class . '_BAR',
                    'width' => $this->width,
                    'bgcolor' => $this->bgcolor,
                ), array (
                    $this->create('button', array(
                        'id' => $this->id . ':THUMB',
    //                  'icon' => $this->image_vbar,
                        'class' => $this->class . '_THUMB',
                        'disabled' => $this->disabled,
                        'width' => $this->bwidth,
                        'height' => $this->bheight,
                        'style' => 'position: relative; top: 0; left: 0;',
                        'minwidth' => '',
                        'minheight' => '',
                        'tabindex' => -1
                    ))
                )),
                $this->create('button', array(
                    'id' => $this->id . ':DOWN',
                    'icon' => $this->image_down,
                    'disabled' => $this->disabled,
                    'class' => $this->class . '_BUTTON',
                    'width' => $this->bwidth,
                    'height' => $this->bheight,
                    'style' => 'position: relative; top: 0; left: 0;',
                    'minwidth' => '',
                    'minheight' => '',
                    'tabindex' => -1
                ))
        ));

        $output = $scrollbar->toHTML();
        $scrollbar->destroy();

        return $output;
    }

    private function createHScrollBar()
    {
        $scrollbar = $this->create('div', array(
                'id' => $this->id,
                'class' => $this->class,
                'style' => $this->style,
                'height' => $this->height,
                'width' => '100%'
            ), array(
                $this->create('button', array(
                    'id' => $this->id . ':UP',
                    'icon' => $this->image_left,
                    'disabled' => $this->disabled,
                    'class' => $this->class . '_BUTTON',
                    'width' => $this->bwidth,
                    'height' => $this->bheight,
                    'style' => 'position: relative; top: 0; left: 0',
                    'minwidth' => '',
                    'minheight' => '',
                    'tabindex' => -1
                )),
                $this->create('div', array(
                    'id' => $this->id . ':BAR',
                    'height' => $this->height,
                    'bgcolor' => $this->bgcolor,
                    'style' => 'position: relative'
                ), array(
                    $this->create('button', array(
                        'id' => $this->id . ':THUMB',
//                      'icon' => $this->image_hbar,
                        'class' => $this->class . '_THUMB',
                        'disabled' => 1,
                        'width' => $this->bwidth,
                        'height' => $this->bheight,
                        'style' => "position: relative;",
                        'minwidth' => '',
                        'minheight' => '',
                        'tabindex' => -1
                    ))
                )),
                $this->create('button', array(
                    'id' => $this->id . ':DOWN',
                    'icon' => $this->image_right,
                    'disabled' => $this->disabled,
                    'class' => $this->class . '_BUTTON',
                    'width' => $this->bwidth,
                    'height' => $this->bheight,
                    'minwidth' => '',
                    'minheight' => '',
                    'style' => 'position:relative',
                    'tabindex' => -1
                ))
        ));

        $output = $scrollbar->toHTML();
        $scrollbar->destroy();

        return $output;
    }

    protected function _toHTML()
    {
        $output = $this->orientation == 'horizontal' ? $this->createHScrollBar() : $this->createVScrollBar();

        $sc = $this->client->init('OK_Object_ScrollBar', $this->id, $this->value, $this->min, $this->max, $this->small, $this->large, $this->orientation == 'vertical', $this->disabled);
        $this->process_events($sc);

        return $output;
    }
}

