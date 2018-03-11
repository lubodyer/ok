<?php
/**
 * This file contains the Video OK Object.
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
 * Video - OK Object
 *
 * HTML5 Video Streaming
 *
 * @package Objects
 * @subpackage HTML
 */
class OK_Object_Video extends OK_Object
{
    /** */
    protected $_type = 'video';

    /**
     *
     */
    protected $autoplay = false;

    /**
     *
     */
    protected $class = 'OK_VIDEO';

    /**
     *
     */
    protected $objects = true;

    /**
     *
     */
    protected $height = '';

    /**
     *
     */
    protected $loop = true;

    /**
     *
     */
    protected $preload = 'none';

    /**
     *
     */
    protected $src;

    /**
     *
     */
    protected $style;

    /**
     *
     */
    protected $type;

    /**
     *
     */
    protected $width = '';

    /**
     *
     */
    protected $webkitinline = true;

    // --

    protected $_accept = null;
    protected $_events = array("onended", "onswiping", "onswipe", "oncanplay", "oncanplaythrough", "onloadedmetadata", "onloadstart", "onloadstart", "onloadeddata");
    protected $_objects = array('style' => 'OK_Style');
    protected $_params = array('autoplay', 'class', 'controls', 'height', 'preload', 'src', 'type', 'style', 'width', 'webkitinline');
    protected $_styles = array('video');
    protected $_scripts = array('video');

    protected function _toHTML()
    {
        $ref = $this->client->init('OK_Object_Video', $this->id);
        $this->process_events($ref);

        $output = "<video id='$this->id'";
        if ($this->class) $output .= " class='$this->class'";
        if ($this->width) $output .= " width='$this->width'";
        if ($this->height) $output .= " height='$this->height'";
        if (!$this->style->isEmpty()) $output .= " style='" . $this->style->toString() . "'";
        if ($this->autoplay) $output .= " autoplay=\"1\"";
        if ($this->preload) $output .= " preload='$this->preload'";
        if ($this->controls) $output .= " controls='1'";
        if ($this->webkitinline) $output .= " webkit-playsinline='1'";
        if ($this->loop) $output .= " loop='1'";
        $output .= ">";
        $source = preg_split("/[,;][ \t]*/", $this->src);
        $type = preg_split("/,[ \t]*/", $this->type);
        if ($source) for ($i = 0, $l = count($source); $i < $l; $i++) {
            $output .= "<source src='$source[$i]' type='$type[$i]'/>";
        };

        return $output . ">Your browser does not support HTML5 video streaming.</video>";
    }
}

