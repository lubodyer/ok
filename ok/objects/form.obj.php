<?php
/**
 * This file contains the Form OK Object.
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
 * Form - OK Object
 *
 * Groups its children in a Form. Forms enable client to submit data to the server. You can
 * design a form to collect data using a variety of Objects, such as
 * {@link OK_Object_Input} or {@link OK_Object_File}.
 *
 * @package Objects
 * @subpackage Input
 */
class OK_Object_Form extends OK_Object
{
    /**
     *
     *
     */
    protected $_type = 'form';

    /**
     *
     *
     * @var string
     */
    protected $action;
    protected $target;
    protected $method = 'post';
    protected $enctype = '';
    protected $autocomplete= '';

    protected $_events = array('onbeforesubmit', 'onsubmit', 'onprocess', 'onsuccess');
    protected $_params = array('id', 'action', 'target', 'method', 'enctype', 'autocomplete');
    protected $_scripts = array('form');
    protected $_validsate = array(
        'method' => array('get', 'post')
    );

    protected function _toHTML()
    {
        $ref = $this->client->init('OK_Object_Form', $this->id, $this->method, $this->action);
        $this->process_events($ref);

        $form = "<form id='$this->id' ";
        if ($this->action) {
            $form .= "action='" . $this->ok->create_request($this->action) . "' ";
        }
        $form .= "method='$this->method' enctype='$this->enctype' target='$this->target' style='width:100%;height:100%;'";
        if ($this->autocomplete) {
            $form .= " autocomplete='{$this->autocomplete}'";
        }
        $form .=">" . $this->content->toHTML() . "</form>";

        return $form;
    }
}
