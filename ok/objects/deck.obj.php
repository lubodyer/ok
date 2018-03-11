<?php
/**
 * This file contains the Deck OK Object.
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

/** Deck object extends the Element object. Include the Element object, if not already available. */
if (!class_exists('OK_Object_Element'))
    require_once(dirname(__FILE__) . '/element.obj.php');

/**
 * Deck - OK Object
 *
 * This object displays only only one of its children at a time. Use the {@link $active} server-side
 * property or the {@link activate()} client-side method to control which child is displayed.
 *
 * @package Objects
 * @subpackage Interface
 */
class OK_Object_Deck extends OK_Object_Element
{
    /**
     * Retrieves the string identifying the object type.
     * @var string
     */
    protected $_type = 'deck';

    /**
     * Sets or retrieves the active child object.
     * @var int
     */
    protected $active = 0;

    /**
     * Sets or retrieves the background color of the object.
     * @var string
     */
    protected $bgcolor;

    /**
     * Sets or retrieves the class name of the object.
     * @var string
     */
    protected $class;

    /**
     * Sets or retrieve whether and how the object is rendered.
     * @var string
     */
    protected $display = 'block';

    /**
     * Sets or retrieves the height of the object.
     * @var length
     */
    protected $height = '100%';

    /**
     * Sets or retrieves the custom style declarations.
     * @var mixed
     */
    protected $style;

    /**
     * Sets or retrieves the width of the object.
     * @var length
     */
    protected $width = '100%';

    /**#@+
     * Private or protected properties and methods.
     * @access private
     */

    protected $element = 'div';
    protected $extend = false;
    protected $_accept = array();
    protected $_events = array('onbeforeactivate', 'onactivate', 'onload', 'onunload', 'onbeforeresize', 'onresize');
    protected $_params = array('active', 'bgcolor', 'class', 'display', 'height', 'left', 'margin', 'padding', 'position', 'style', 'top', 'visibilty', 'width');
    protected $_scripts = array('deck');
    protected $_validate = array(
        'active'        => 'int',
        'class'         => 'string',
        'display'       => array('block', 'none'),
        'height'        => 'length',
        'left'          => 'int',
        'margin'        => 'int',
        'padding'       => 'int',
        'position'      => array('', 'absolute', 'relative'),
        'style'         => 'string',
        'top'           => 'int',
        'visibility'    => array('', 'hidden', 'visible'),
        'width'         => 'length'
    );

    protected function _toHTML()
    {
        $this->nochildrenresize = true;

        for ($i = 0; $i < $this->content->length; $i++)
        {
            $item = $this->content->get($i);
            $item->style->display = $i == $this->active ? "" : "none";
        }

        $ref = $this->client->init('OK_Object_Deck', $this->id, $this->active);
        $this->process_events($ref);

        return parent::_toHTML();
    }

    /**#@-*/
}
