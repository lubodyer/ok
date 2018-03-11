<?php
/**
 * This file contains the CheckBox OK Object.
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
 * CheckBox - OK Object
 *
 * Displays a checkbox that allows the user to select a true or false condition.
 *
 * @package Objects
 * @subpackage Input
 */
class OK_Object_CheckBox extends OK_Object
{
    /** */
    protected $_type = 'checkbox';

    /**
     * Sets or retrieves the class name of the object.
     * @var string
     */
    protected $class = 'OK_CHECKBOX';

    /**
     * Sets or retrieves a value indicating whether the object is disabled.
     * @var boolean
     */
    protected $disabled = false;

    /**
     * Sets or retrieves the width of the object.
     * @var length
     */
    protected $width = 40;

    /**
     * Sets or retrieves the height of the object.
     * @var length
     */
    protected $height = 40;

    /**
     * Sets or retrieves the index that defines the tab order for the object.
     * @var int
     */
    protected $tabindex = 0;

    /**
     * Sets or retrieves a value indicating whether the check box is checked.
     * @var boolean
     */
    protected $checked = false;

    protected $_accept = null;
    protected $_objects = array('style' => 'OK_Style');
    protected $_events = array('ontoggle', 'onbeforetoggle');
    protected $_params = array('class', 'disabled', 'checked', 'height', 'style', 'tabindex', 'title', 'width');
    protected $_readonly = array('width', 'height');
    protected $_scripts = array('button', 'checkbox');
    protected $_styles = array('button', 'checkbox');

    protected function _toHTML()
    {
        $this->style->display = "inline-table";

        $tbox = $this->create('table',array(
            'id' => $this->id,
            'width' => $this->width,
            'height' => $this->height,
            'title' => $this->title,
            'class' => $this->class . '_BOX',
            'style' => $this->style
        ));
        $tbox->setCellAttributes(1, 1, array(
            'align' => 'center',
            'valign' => 'middle'
        ));

        $t = $this->create('table');
        $t->setTableAttributes(array(
            'id' => $this->id . ':BTN',
            'width' => 22,
            'height' => 22,
            'class' => $this->class . '_OUT',
        ));

        $t->setCellAttributes(1, 1, array(
            'id' => $this->id . ':BTN:in',
            'align' => 'center',
            'valign'=> 'middle',
            'class'=> $this->class . '_IN'
        ));

        $t->setCellContent(1, 1, $this->create('image', array(
            'id' => $this->id . ':IMAGE',
            'src' => 'check.png',
            'app_id' => '.'
        )));


        $tbox->setCellContent(1, 1, $t);
        $output = $tbox->toHTML();

        $ref = $this->client->init('OK_Object_CheckBox', $this->id, $this->tabindex, !$this->disabled, $this->checked, $this->class);
        $this->process_events($ref);

        return $output;
    }
}
