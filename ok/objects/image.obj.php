<?php
/**
 * This file contains the Image OK Object.
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
 * Image - OK Object
 *
 * Allows you to load an image of any format supported by the client.
 *
 * @package Objects
 * @subpackage Interface
 */
class OK_Object_Image extends OK_Object
{
    /**
     * Retrieves the string identifying the object type.
     * @var string
     */
    protected $_type = 'image';

    /**
     * @ignore
     */
    protected $app_id;

    /**
     * Sets or retrieves the class name of the object.
     * @var string
     */
    protected $class;

    /**
     * Sets or retrieves the height of the object.
     * @var mixed
     */
    protected $height;

    /**
     * Sets or retrieves the location to the image file.
     * @var string
     */
    protected $src;

    /**
     * Sets or retrieves the custom style of the object.
     * @var string
     */
    protected $style;

    /**
     * Sets or retrieves the title to be displayed when the user hovers the mouse over the object.
     * @var string
     */
    protected $title;

    /**
     * Sets or retrieves the width of the object.
     * @var mixed
     */
    protected $width;

    /**
     * @ignore
     * @var string
     */
    protected $usemap = "";

    /**
     *
     */
    protected $cache_id = "";

    /**
     *
     */
    protected $html = true;

    /**#@+
     * @access private
     */

    protected $_accept = null;
    protected $_objects = array('style' => 'OK_Style');
    protected $_params = array('class', 'app_id', 'cache_id', 'height', 'src', 'style', 'title', 'width', 'usemap', 'html');
    protected $_validate = array(
        'class'     => 'string',
        'height'    => 'length',
        'src'       => 'string',
        'style'     => 'string',
        'title'     => 'string',
        'width'     => 'length',
        'usemap'    => 'string',
        'app_id'    => 'string',
        'html'      => 'bool'
    );

    /**#@-*/

    protected function onbeforeload($params)
    {
        if (isset($params) && isset($params[0]) && isset($params[0]['app_id'])) {
            $this->app_id = $params[0]['app_id'];
        } else if ($this->engine) {
            $this->app_id = $this->engine->app_id;
        }
    }

    protected function onset($params)
    {
        if ($params[0] == "src" || $params[0] == "app_id")
        {
            if ($params[0] == "src") {
                $this->src = $params[1];
            } elseif ($params[0] == "app_id") {
                $this->app_id = $params[1];
            }

            if ($this->src && !preg_match("/^(http(s)?\:\/)?\//", $this->src))
            {
                if (false !== ($data = $this->get())) {
                    if (!$this->width && !$this->height) {
                        $this->width = $data['width'];
                        $this->height = $data['height'];
                    }
                    $this->cache_id = $this->preload_image($this->src);
                }
            }

            return true;
        }
    }

    /**
     *
     */
    public function get($bgaverage = false)
    {
        if (!preg_match("/^((http(s)?:\/)|\/)\//", $this->src)) {
            try {
                return $this->ok->images->get_image_data($this->src, $this->app_id ? $this->app_id : '.', $bgaverage);
            } catch (OK_Exception $x) {
                trigger_error("Error getting image data: $this->src", E_USER_WARNING);
            }
        }

        return false;
    }

    /**
     * Retrieves the output of the object.
     */
    protected function _toHTML()
    {
        if (!$this->src) {
            trigger_error("Error creating image - src attribute is empty. Object output omitted.", E_USER_WARNING);
            return '';
        }

        if ($this->html)
        {
            if ($this->cache_id) {
                $cid = md5($this->cache_id);
                $output = array("<img id='$this->id' src='//:0' data-ok-id='$cid'");
            } else {
                $output = array("<img id='$this->id' src='$this->src'");
            }

            if ($this->class) $output[] = "class='$this->class'";
            if ($this->width) $output[] = "width='$this->width'";
            if ($this->height) $output[] = "height='$this->height'";
            if ($this->title) $output[] = "title='$this->title'";
            if (!$this->style->isEmpty()) $output[] = "style='".$this->style->toString()."'";
            if ($this->usemap) $output[] = "usemap='$this->usemap'";

            if ($this->client->moz || $this->client->safari)
                $output[] = "onmousedown='event.preventDefault();'";

            $output = implode(' ', $output) . '/>';

            return $output;
        }

        return "";
    }

}

