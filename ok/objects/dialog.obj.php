<?php
/**
 * This file contains the Dialog OK Object.
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
 * Dialog - OK Object
 *
 * Dialogs enable communication between the application and the user. Use dialogs to communicate information,
 * prompt for a response, or both. Depending on the type of the desired <i>user interaction</i> dialogs can
 * be <i>modal</i> or <i>modeless</i>:
 *
 * - <b>Modal dialog</b>. This is the default dialog type. Modal dialogs temporarily halt the application and the
 *   user cannot continue until the dialog has been closed. To create modal dialog set the {@link $type}
 *   property to <code>"modal"</code>.
 *
 * - <b>Modeless dialog</b>. Modeless dialogs are useful when the requested information is not essential to continue,
 *   and so the dialog can be left open while work continues elsewhere. To create modeless dialog set the
 *   {@link $type} property to <code>"modeless"</code>.
 *
 * @package Objects
 * @subpackage Interface
 */
class OK_Object_Dialog extends OK_Object
{
    /** */
    protected $_type = 'dialog';

    /**
     * Sets or retrieves whether or not to center the object.
     * @var bool
     */
    protected $center = false;

    /**
     * Sets or retrieves the class name of the object.
     * @var string
     */
    protected $class = "OK_DIALOG";

    /**
     * Sets or retrieves whether the object can be closed.
     * @var bool
     */
    protected $close = true;

    /**
     *
     * @var string
     */
    protected $dock = '';

    /**
     * Sets or retrieves the height of the object.
     * @var int
     */
    protected $height = 200;

    /**
     * Sets or retrieves the location of the icon of the object.
     * @var string
     */
    protected $icon;

    /**
     * Sets or retrieves the position of the object relative to the left edge of the client screen.
     * @var int
     */
    protected $left = 100;

    /**
     * Sets or retrieves whether to show the dialog as soon as it is transfered to the client.
     * @var boolean
     */
    protected $show = true;

    /**
     * Sets or retrieves the position of the object relative to the top of the client screen.
     * @var int
     */
    protected $top = 50;

    /**
     * Sets or retrieves the string identifying the type of the dialog object.
     *
     * String that specifies or receives one of the following values: "modal" (default) or "modeless".
     *
     * @var string
     * @iname type-dialog
     */
    protected $type = "modal";

    /**
     * Sets or retrieves the width of the object.
     * @var length
     */
    protected $width = 400;


    /**#@+
     * @access private
     */

    protected $_app_id;
    protected $_childof = null;
    protected $_events = array('onclose', 'onhide', 'onload', 'onshow', 'onbeforeshow', 'onbeforehide', 'onfocus', 'onblur');
    protected $_params = array('center', 'class', 'close', 'dock', 'height', 'show', 'width', 'type', 'left', 'top');
    protected $_styles = array('dialog');
    protected $_validate = array(
        'bgcolor'       => 'string',
        'border'        => 'int',
        'center'        => 'bool',
        'class'         => 'string',
        'close'         => 'bool',
        'move'          => 'bool',
        'show'          => 'bool',
        'titlecolor'    => 'string',
        'type'          => array('modal', 'modeless')
    );

    /**
     *
     */
    protected function onbeforeload()
    {
        if ($this->engine) {
            $this->_app_id = $this->engine->app_id;
        }
    }

    /**
     *
     */
    protected function _toHTML()
    {
        $this->ok->_dialogs->__load($this);
    }

    /**
     *
     */
    protected function __toHTML()
    {
        $ref = $this->client->get($this->id);
        $this->client->call($ref, 'moveTo', $this->left, $this->top);
        $this->client->call($ref, 'resizeTo', $this->width, $this->height);
        $this->process_events($ref);

        return $this->content->toHTML();
    }

    /**#@-*/
}
