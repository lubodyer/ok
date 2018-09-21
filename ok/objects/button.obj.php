<?php
/**
 * This file contains the Button OK Object.
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
 * Button - OK Object
 *
 * The button represents a rectangular area that will perform an action when the user clicks it.
 * Buttons are labeled with text and/or icon. This object supports the following three types of
 * buttons - <i>push button</i>, <i>toggle button</i> and <i>menu button</i>:
 *
 * - <b>Push button</b>. This is the default type of the button object. To create a push button
 *   set the {@link $type} property to "push" and use the {@link $onaction} event handler to
 *   specify the client-side behaviour of the object.
 *
 * - <b>Toggle button</b>. To create a toggle button, set the {@link $type type} property to
 *   "toggle". The {@link $state} property controls the initial on/off (up/down) state of the
 *   button. Use the {@link $ontoggle} event handler to specify the client-side behaviour of the
 *   object.
 *
 * - <b>Menu button</b>. To create a menu button add a {@link OK_Object_Menu} object to the
 *   button's content collection. Use the {@link OK_Object_MenuItem}'s "onaction" events to
 *   specify the client-side behaviour of the object.
 *
 * @package Objects
 * @subpackage Input
 */
class OK_Object_Button extends OK_Object
{
    /**
     * Retrieves the string identifying the type of the Object.
     * @var string
     */
    protected $_type = 'button';

    /**
     * Sets or retrieves the access key of the object.
     * @var mixed Char or 'auto'.
     * @todo Implement accesskey attribute
     * @ignore
     */
    protected $accesskey = 'auto';

    /**
     * Sets or retrieves the horizontal alignment of the content of the object.
     * @var string
     */
    protected $align = 'center';

    /**
     * Sets or retrieves the value indicating whether to show the button arrow.
     * @var boolean
     */
    protected $arrow = null;

    /**
     *
     */
    protected $arrowsrc = 'down.gif';

    /**
     *
     */
    protected $async = true;

    /**
     * Sets or retrieves the class name of the object.
     * @var string
     */
    protected $class = 'OK_BUTTON';

    /**
     * Sets or retrieves whether or not the button is the default button.
     * @var bool
     */
    protected $default = false;

    /**
     * Sets or retrieves whether or not object is disabled.
     * @var boolean
     */
    protected $disabled = false;
    
    /**
     * Specifies whether or not to extend object controller to client-side.
     * @var boolean
     */
    protected $extend = true;

    /**
     * Sets or retrieves the height of the object.
     * @var mixed
     */
    protected $height = '100%';

    /**
     * Sets or retrieves the icon of the object.
     * @var string
     */
    protected $icon;

    /**
     * Sets or retrieves the label of the obect.
     * @var string
     */
    protected $label = "";

    /**
     * Sets or retrieves the string identifying the menu of the object.
     * @var string
     */
    protected $menu;

    /**
     * Sets or retrieves the layout orientation.
     * @var string
     */
    protected $orientation = 'horizontal';

    /**
     * If true, the object will strive to take as less space as possible instead of as much as possible.
     * @var boolean
     */
    protected $pack = false;

    /**
     * Sets or retrieves the padding between the object and the content.
     * @var int
     */
    protected $padding = 0;

    /**
     * Sets or retrieves the spacing between the icon and the label.
     * @var int
     */
    protected $spacing = 4;

    /**
     * For 'toggle' buttons sets or retrieves the on/off state of the object.
     * @var string
     */
    protected $state = false;

    /**
     * Sets or retrieves the custom style declarations for the object.
     * @var string
     */
    protected $style;

    /**
     * Sets or retrieves the custom style declarations for the object.
     * @var string
     */
    protected $istyle;

    /**
     * Sets or retrieves the index that defines the tab order for the object.
     * @var int
     */
    protected $tabindex = 0;

    /**
     * Sets or retrieves the title to be displayed when the user hovers the mouse over the object.
     * @var string
     */
    protected $title;

    /**
     * Sets or retrieves the type of the button.
     *
     * String that specifies or receives one of the following values: "push", "toggle" or "menu".
     *
     * @var string
     * @iname type-button
     */
    protected $type = 'push';

    /**
     * Sets or retrieves the width of the object.
     * @var mixed
     */
    protected $width = '100%';

    /**
     * Allow text to be wrapped.
     * @var boolean
     */
    protected $wrap = false;

    /**
     * Sets or retrieves the vertical alignment of the content of the object.
     * @var string
     */
    protected $valign = 'middle';

    /**
     *
     */
    protected $minwidth = 40;

    /**
     *
     */
    protected $minheight = 40;

    /**#@+
     * Object configuration settings.
     * @access private
     */

    protected $_app_id;
    protected $_accept = array('image', 'label', 'menu', 'sharedicon');
    protected $_events = array('onaction', 'onbeforetoggle', 'onblur', 'onclick', 'oncontextmenu', 'ondoubleclick', 'onfocus', 'onkeydown', 'onkeypress', 'onkeyup', 'onmousedown', 'onmouseout', 'onmouseover', 'onmouseup', 'ontoggle', 'onunload');
    protected $_objects = array('style' => 'OK_Style', 'istyle' => 'OK_Style');
    protected $_params = array('accesskey', 'align', 'arrow', 'class', 'default', 'disabled', 'extend', 'height', 'icon', 'label', 'menu', 'orientation', 'pack', 'padding', 'show_arrow', 'spacing', 'state', 'style', 'istyle', 'tabindex', 'title', 'type', 'width', 'wrap', 'valign', 'arrowsrc', 'minwidth', 'minheight');
    protected $_scripts = array('button');
    protected $_styles = array('button');
    protected $_validate = array(
        'align'         => array('left', 'right', 'center'),
        'accesskey'     => 'string',
        'async'         => 'bool',
        'class'         => 'string',
        'default'       => 'bool',
        'disabled'      => 'bool',
        'height'        => 'length',
        'orientation'   => array('horizontal', 'vertical'),
        'pack'          => 'bool',
        'padding'       => 'int',
        'spacing'       => 'int',
        'state'         => 'bool',
        'tabindex'      => 'int',
        'type'          => array('push', 'toggle'),
        'width'         => 'length',
        'wrap'          => 'bool',
        'valign'        => array('top', 'middle', 'bottom')
    );

    protected $_class = 'OK_BUTTON';

    /**#@-*/

    protected function onbeforeload()
    {
        if ($this->engine) {
            $this->_app_id = $this->engine->app_id;
        }
    }

    /**
     * Retreieves the output of the object.
     * @return string
     */
    protected function _toHTML()
    {
        $className = $this->class;
        if ($this->default) {
            $className .= "_FOCUSED";
        }

        if ($this->width && !$this->style->width) {
            $this->style->width = $this->width;
        }
        if ($this->minwidth && !$this->style->{'min-width'}) {
            $this->style->{'min-width'} = $this->minwidth;
        }
        if ($this->height && !$this->style->height) {
            $this->style->height = $this->height;
        }
        if ($this->minheight && !$this->style->{'min-height'}) {
            $this->style->{'min-height'} = $this->minheight;
        }

        // --

        $icon = null;
        $label = null;
        $menu = null;

        // --

        for ($i = 0; $i < $this->content->length; $i++) {
            $item = $this->content->get($i);
            if (!is_object($item)) {
                $this->label = $item;
            } elseif ($item->_type == "image" || $item->_type == "sharedicon") {
                $icon = $item;
            } elseif ($item->_type == "label") {
                $label = $item;
            } elseif ($item->_type == "menu") {
                $menu = $item;
            } elseif ($item instanceof OK_Object) {
                $this->label .= $item->toHTML();
            }
        }

        $this->content->clear();

        if (is_null($icon) && !empty($this->icon)) {
            $icon = $this->create('image', array('app_id' => $this->_app_id, 'src' => $this->icon));
        }

        if (is_null($label) && !empty($this->label)) {
            $label = $this->create('div', array('value' => $this->label));
        }

        // --

        if (is_null($menu)) {
            if (is_string($this->menu)) {
                $menu = $this->ok->get($this->menu);
                if (!is_object($menu) || $this->menu->_type !== 'menu') {
                    $menu = null;
                    trigger_error("Button $this->id - invalid button menu!", E_USER_WARNING);
                }
            }
        }

        if ($menu)
        {
            $this->type = 'toggle';
            $this->state = false;
            if ($this->arrow === null) {
                $this->arrow = true;
            }
        }

        // --

        $output = array();

        $output[] = '<table cellspacing="0" cellpadding="0" align="';
        $output[] = $this->align;
        $output[] = '"><tr>';

        $span = false;
        if ($icon) {
            $icon->id = $this->id . ":ICON";

            if ($this->pack) {
                $this->width = $icon->width;
                $this->height = $icon->height;
            }

            $output[] = '<td id="' . ($this->id . ':IPANE') . '" align="center" valign="middle" style="';
            $output[] = 'line-height:100%;">';
            $output[] = $icon->toHTML();
            $output[] = '</td>';

            if ($this->arrow && $this->orientation == "vertical") {
                $span = true;
                $arrow = $this->create('image', array('id' => $this->id . ":ARROW", 'src' => $this->arrowsrc), array(), false, true);
                if ($this->spacing) {
                    $arrow->style->set("margin-left", $this->spacing . "px");
                    $arrow->style->set("margin-right", $this->spacing . "px");
                }
                $output[] = '<td rowspan="2" style="line-height:100%;">';
                $output[] = $arrow->toHTML();
                $output[] = '</td>';
            }
        }


        if ($label) {
            $label->id = $this->id . ":TEXT";
            $label->wrap = $this->wrap;
            $label->style->{"line-height"} = "100%";

            if ($this->orientation == "vertical") {
                $label->element = "div";
                $label->style->display = "block";
                $label->style->{"text-align"} = "center";

            }

            if ($icon && $this->orientation == "vertical") {
                $output[] = '</tr><tr>';
            }

            $output[] = '<td style="';
            if ($this->spacing && $icon) {
                if ($this->orientation == "horizontal") {
                    $output[] = 'padding-left: ' . $this->spacing . 'px;';
                } else {
                    $output[] = 'padding-top: ' . $this->spacing . 'px;';
                }
            }
            $output[] = 'line-height:100%;">';
            $output[] = $label->toHTML();
            $output[] = '</td>';
        }

        if (!$span && $this->arrow) {
            $arrow = $this->create('image', array('id' => $this->id . ":ARROW", 'src' => $this->arrowsrc), array(), false, true);

            if ($this->spacing) {
                $arrow->style->set($this->orientation == "horizontal" ? "margin-left" : "margin-top", $this->spacing . "px");
                $arrow->style->set($this->orientation == "horizontal" ? "margin-right" : "margin-bottom", $this->spacing . "px");
            }

            if (($icon || $label) && $this->orientation == "vertical") {
                $output[] = '</tr><tr>';
            }

            $output[] = '<td valign="middle" style="line-height:100%;">';
            $output[] = $arrow->toHTML();
            $output[] = '</td>';
        }

        $output[] = '</tr></table>';

        $content = implode($output);

        // --

        $output = array();

        $output[] = '<table id="';
        $output[] = $this->id;
//      $output[] = '" width="';
//      $output[] = $this->width;
//      $output[] = '" height="';
//      $output[] = $this->height;
        $output[] = '" title="';
        $output[] = $this->title;
        $output[] = '" cellspacing="0" cellpadding="';
        $output[] = $this->padding;
        $output[] = '" class="';
        $output[] = $className;
        $output[] = '_OUT" style="';
        $output[] = $this->style->toString();
        $output[] = '"><tr><td id="';
        $output[] = $this->id;
        $output[] = ':in" align="';
        $output[] = $this->align;
        $output[] = '" valign="';
        $output[] = $this->valign;
        $output[] = '" class="';
        $output[] = $className;
        $output[] = '_IN" style="';
        $output[] = $this->istyle->toString();
        $output[] = '">';
        $output[] = $content;
        $output[] = '</td></tr></table>';

        // --

        $accesskey = $this->accesskey && $this->accesskey != 'auto' ? ('a' . ord(strtoupper($this->accesskey))) : '';
        
        // -
        
        if ($this->extend) {
            $btn = $this->client->init('OK_Object_Button', $this->id, $this->tabindex, !$this->disabled, $this->class, $accesskey, $this->default);
            if ($this->type == "toggle") {
                $this->client->call($btn, 'setToggle', true);
                if ($this->state)
                    $this->client->call($btn, 'setValue', true, true);
            }
            $this->client->set($btn, 'async', $this->async);
            if ($menu) {
                $output[] = $menu->toHTML();
                $this->client->call($btn, 'addMenu', $menu->id);
            }
            $this->process_events($btn);
        }

        // ---

        return implode($output);
    }

    /**
     * Sets the text of the button label.
     * @param string $text
     */
    public function write($text)
    {
        $this->label = $text;
    }

}
