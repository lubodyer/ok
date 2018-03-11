<?php
/**
 * This file contains File OK Object.
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
 * File - OK Object
 *
 * Creates a file upload object with a text box and Browse button. This object is only useful when
 * it is a child of a {@link OK_Object_Form}. To enable the file transfer to the server, you
 * must set the {@link OK_Object_Form::$enctype} property value in the parent form to
 * <b>"multipart/form-data"</b>. You must also set the {@link OK_Object_Form::$method} property
 * of the form to <b>"post"</b>.
 *
 * @package Objects
 * @subpackage Input
 */
class OK_Object_File extends OK_Object
{
    /**
     * Retrieves the string identifying the object type.
     * @var string
     */
    protected $_type = 'file';

    protected $class = '';
    protected $size;
    protected $style;

    protected $tabindex = 0;

    protected $disabled = false;

    protected $width = '100%';
    protected $height = 24;

    /**#@+
     * @access private
     */
    protected $_accept = null;
    protected $_events = array('onfocus', 'onblur', 'onchange', 'onkeydown', 'onkeypress', 'onkeyup', 'onclick', 'onmouseover', 'onmouseout', 'onmousedown', 'onmouseup', 'onload');
    protected $_params = array('name', 'disabled', 'size', 'tabindex', 'class', 'style', 'width', 'height');

    protected function _toHTML()
    {
        if (preg_match("/^[0-9]+$/", $this->height))
            $this->style = 'height:' . $this->height . 'px;' . $this->style;
        elseif (preg_match("/^[0-9]+%$/", $this->height))
            $this->style = 'height:' . $this->height . ';' . $this->style;

        if (preg_match("/^[0-9]+$/", $this->width))
            $this->style = 'width:' . $this->width . 'px;' . $this->style;
        elseif (preg_match("/^[0-9]+%$/", $this->width))
            $this->style = 'width:' . $this->width . ';' . $this->style;

        $output = "<input id='$this->id' type='file' class='$this->class' style='$this->style'";
        if ($this->name) $output .= " name='$this->name'";
        if ($this->disabled) $output .= " disabled";
        if ($this->size) $output .= " size='$this->size'";

        for ($i = 0, $l = count($this->_events); $i < $l; $i++)
            if ($this->__get($this->_events[$i]))
                $output .= ' ' . $this->_events[$i] . ' = "' . $this->__get($this->_events[$i]) . '"';

        $output .= "/>";

        return $output;
    }

    /**#@-*/
}
