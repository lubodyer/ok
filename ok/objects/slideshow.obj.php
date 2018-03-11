<?php
/**
 * This file contains the SlideShow OK Object.
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
 * SlideShow - OK Object
 *
 * @package Objects
 * @subpackage Interface
 */
class OK_Object_SlideShow extends OK_Object
{
    /**
     * Retrieves the string identifying the type of the Object.
     * @var string
     */
    protected $_type = 'slideshow';

    /**
     *
     */
    protected $class = "OK_SLIDESHOW";

    /**
     *
     */
    protected $opacity = 1;

    /**
     *
     */
    protected $style;

    /**
     *
     */
    protected $tabindex = 0;

    /**
     *
     */
    protected $width = '100%';

    /**
     *
     */
    protected $height = '100%';

    /**#@+
     * @access private
     */

    protected $_events = array('onaction', "onswiping", "onswipe", "ontap", "onmousedown", "onaction");
    protected $_params = array('class', 'style', 'tabindex', 'width', 'height', 'opacity');
    protected $_objects = array('style' => 'OK_Style');
    protected $_scripts = array('slideshow');
    protected $_styles = array('slideshow');

    /**
     * Retrieves the output of the object.
     * @return string
     */
    protected function _toHTML()
    {
        $output = $this->create('div', array(
            'id' => $this->id,
            'class' => $this->class,
            'style' => $this->style,
            'width' => $this->width,
            'height' => $this->height,
            'nochildrenresize' => true
        ), array(
            $this->create('progressbar', array(
                'id' => $this->id . ':PROGRESS',
                'class' => $this->class . '_PROGRESS',
                'height' => 3,
                'style' => 'position: absolute; left: 0; top: 0; display: none;'
            )),
            $this->create('div', array(
                'id' => $this->id . ':NAV',
                'class' => $this->class . '_NAV',
        ))))->toHTML();

        $ref = $this->client->init('OK_Object_SlideShow', $this->id, $this->class, $this->tabindex, $this->opacity);
        $this->process_events($ref);

        return $output;
    }

    /**#@-*/
}
