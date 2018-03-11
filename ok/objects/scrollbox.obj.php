<?php
/**
 * This file contains the ScrollBox OK Object.
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
 * ScrollBox - OK Object
 *
 * This object allows you to display data that is larger than the object area and therefore
 * requires the ability to scroll. The {@link OK_Object_ScrollBar scroll bars} are
 * displayed as needed to enable the user to bring into view the portions of the data that
 * are located outside the bounds of the object.
 *
 * @package Objects
 * @subpackage Interface
 */
class OK_Object_ScrollBox extends OK_Object
{
    /**
     * Retrieves the string identifying the type of the Object.
     * @var string
     */
    protected $_type = 'scrollbox';

    /**
     *
     */
    protected $bgcolor;

    /**
     *
     *
     */
    protected $class = 'OK_SCROLLBOX';

    /**
     *
     * @var length
     */
    protected $height = '100%';


    /**
     *
     * @var int
     */
    protected $padding = 0;

    /**
     *
     *
     */
    protected $style;

    /**
     *
     * @var int
     */
    protected $tabindex = 0;

    /**
     *
     * @var length
     */
    protected $width = '100%';


    protected $overflow = "scroll";


    /**#@+
     * @access private
     */
    protected $_events = array('onscroll', 'onbeforeresize', 'onresize');
    protected $_params = array('bgcolor', 'class', 'height', 'padding', 'style', 'tabindex', 'width', 'overflow');
    protected $_objects = array('style' => 'OK_Style');
    protected $_scripts = array('scrollbox');
    protected $_styles = array('scrollbox');

    /**
     * Retrieves the output of the object.
     * @return string
     */
    protected function _toHTML()
    {
        $output = $this->create('div', array(
                'id' => $this->id,
                'class' => $this->class,
                'width' => $this->width,
                'height' => $this->height,
                'style' => $this->style,
                'nochildrenresize' => true
            ), array (
                $this->create('div', array(
                    'id' => $this->id . ':DATA',
                    'class' => $this->class . '_DATA',
                    'padding' =>$this->padding
                ), array (
                    $this->content->toHTML()
                )
            )));

        $output->add($this->create('vscrollbar', array(
            'id' => $this->id . ':VSCROLL',
            'style' => 'position: absolute; display: none;'
        )));

        $output->add($this->create('hscrollbar', array(
            'id' => $this->id . ':HSCROLL',
            'style' => 'position: absolute; display: none;'
        )));

        $output = $output->toHTML();

        // --

        $ref = $this->client->init('OK_Object_ScrollBox', $this->id, $this->tabindex, $this->overflow);
        $this->process_events($ref);

        // --

        return $output;
    }

    /**#@-*/
}
