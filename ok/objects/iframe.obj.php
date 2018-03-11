<?php
/**
 * This file contains the IFrame OK Object.
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
 * IFrame - OK Object
 *
 * @package Objects
 * @subpackage HTML
 */
class OK_Object_IFrame extends OK_Object
{
    /** */
    protected $_type = 'iframe';

    /**
     *
     */
    protected $class = 'OK_IFRAME';

    /**
     *
     */
    protected $height = '100%';

    /**
     *
     */
    protected $src = "";

    /**
     *
     */
    protected $style;

    /**
     *
     */
    protected $width = '100%';

    // --

    protected $_accept = null;
    protected $_objects = array('style' => 'OK_Style');
    protected $_params = array('class', 'height', 'src', 'style', 'width');
    protected $_styles = array('iframe');

    protected function _toHTML()
    {
        $output = "<iframe id='$this->id'";
        if ($this->class) $output .= " class='$this->class'";
        if ($this->width) $output .= " width='$this->width'";
        if ($this->height) $output .= " height='$this->height'";
        if ($this->src) $output .= " src='$this->src'";
        if (!$this->style->isEmpty()) $output .= " style='" . $this->style->toString() . "'";
        return $output . "></iframe>";
    }
}

