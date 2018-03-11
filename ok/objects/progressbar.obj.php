<?php
/**
 * This file contains the ProgressBar OK Object
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
 * ProgressBar - OK Object
 *
 * This object can be used to display the progress of a lengthy operation. It is drawn as a bar
 * that is filled as the operation progresses. If the length of the time (or the total number
 * of the items to process) to complete the operation is not known beforehand, the progress can
 * by animated as a sliding bar.
 *
 * @package Objects
 * @subpackage Interface
 */
class OK_Object_ProgressBar extends OK_Object
{
    /** */
    protected $_type = 'progressbar';

    /**
     * Sets or retrieves the current value of the progress bar.
     *
     * Integer specifying a value from 0 to 100.
     *
     * @var int
     * @iname value-progressbar
     */
    protected $value = 0;

    /**
     * Sets or retrieves the class name of the object.
     * @var string
     */
    protected $class = 'OK_PROGRESSBAR';

    /**
     * Sets or retrieves the width of the object.
     * @var length
     */
    protected $width = '100%';

    /**
     * Sets or retrieves the height of the object.
     * @var length
     */
    protected $height = '13';

    protected $align;
    protected $style;

    protected $_images = array('pb.gif');
    protected $_objects = array("style" => "OK_Style");
    protected $_params = array('width', 'height', 'value', 'class', 'barclass');
    protected $_scripts = array('progressbar');
    protected $_styles = array('progressbar');

    /**
     * Retreieves the output of the object.
     * @return string The HTML output of the object.
     */
    protected function _toHTML()
    {
        $this->style->width = $this->width;
        $this->style->height = $this->height;

        $progressbar = $this->create("div", array (
            "id" => $this->id,
            "class" => $this->class,
            "style" => $this->style
        ), array (
            $this->create("div", array(
                "id" => $this->id . ":THUMB",
                "class" => $this->class . "_THUMB"
            ))
        ));

        $ref = $this->client->init('OK_Object_ProgressBar', $this->id, $this->value);

        $output = $progressbar->toHTML();

        $progressbar->destroy();

        return $output;
    }

}
