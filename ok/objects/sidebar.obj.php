<?php
/**
 * This file contains the SideBar OK Object.
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
 * SideBar - OK Object
 *
 * @package Objects
 * @subpackage Interface
 */
class OK_Object_SideBar extends OK_Object
{
    /**
     * Retrieves the string identifying the object type.
     * @var string
     */
    protected $_type = 'sidebar';

    /**
     * Sets or retrieves the class name of the object.
     * @var string
     */
    protected $class = "OK_SIDEBAR";

    /**
     * Sets or retrieves the height of the object.
     * @var mixed
     */
    protected $height = "100%";

    /**
     * Sets or retrieves the custom style of the object.
     * @var string
     */
    protected $style;

    /**
     * Sets or retrieves the width of the object.
     * @var mixed
     */
    protected $width = "100%";

    /**
     *
     */
    protected $transition = "slide";

    /**
     *
     */
    protected $direction = "left";

    /**
     *
     */
    protected $parent_id = "";

    /**#@+
     * @access private
     */

    protected $_accept = null;
    protected $_objects = array('style' => 'OK_Style');
    protected $_params = array('class', 'height', 'style', 'width', 'parent_id', 'transition', 'direction');
    protected $_events = array('onbeforeshow', 'onshow', 'onbeforehide', 'onhide', 'onresize', 'onbeforecancel', 'oncancel');
    protected $_styles = array('sidebar');
    protected $_scripts = array('sidebar');
    protected $_validate = array(
        'class'     => 'string',
        'height'    => 'length',
        'style'     => 'string',
        'parent_id' => 'string',
        'width'     => 'length',
        'transition'    => array('slide', 'show'),
        'direction'     => array('left', 'right', 'bottom', 'top')
    );

    /**#@-*/

    /**
     * Retrieves the output of the object.
     */
    protected function _toHTML()
    {
        $ref = $this->client->init('OK_Object_SideBar', $this->id, $this->parent_id, $this->transition, $this->direction);
        $this->process_events($ref);

        // --

        $output = $this->create('div', array(
            'id' => $this->id,
            'class' => $this->class,
            'style' => $this->style,
            'width' => $this->width,
            'height' => $this->height,
//          'nochildrenresize' => true
        ), array($this->content->toHTML()))->toHTML();

        return $output;
    }
}
