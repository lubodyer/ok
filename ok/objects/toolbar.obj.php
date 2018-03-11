<?php
/**
 * This file contains the ToolBar OK Object.
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
 * ToolBar - OK Object
 *
 * This object is a container for a set of {@link OK_Object_Button Buttons} that perform common
 * actions. Buttons can be divided into logical groups by using {@link OK_Object_ToolbarSeparator ToolbarSeparators}.
 *
 * @package Objects
 * @subpackage Interface
 *
 * @todo fix align
 */
class OK_Object_ToolBar extends OK_Object
{
    /** */
    protected $_type = 'toolbar';

    /**
     * Sets or retrieves the horizontal alignment of the content of the object.
     * @var string
     */
    protected $align = 'left';

    /**
     * Sets or retrieves the color of the background of the object.
     * @var color
     */
    protected $bgcolor;

    /**
     * Sets or retrieves the type of the border of the object.
     * @var string
     */
    protected $border = 'bar';

    /**
     * Sets or retrieves the class name of the {@link OK_Object_Button} objects.
     * @var string
     */
    protected $button = 'OK_TOOLBAR';

    /**
     * Sets or retrieves the class name of the object.
     * @var string
     */
    protected $class = "OK_PANEL";

    /**
     * Sets or retrieves the height of the object.
     * @var length
     */
    protected $height = 44;

    /**
     * Sets or retrieves the padding between the object and the content.
     * @var int
     */
    protected $padding = 2;

    /**
     * Sets or retrieves the custom style declarations for the object.
     * @var OK_Style
     */
    protected $style;

    /**
     * Sets or retrieves the index that defines the tab order for the object.
     * @var int
     */
    protected $tabindex = -1;

    /**
     * Sets or retrieves the width of the object.
     * @var length
     */
    protected $width = "100%";

    protected $_objects = array('style' => 'OK_Style');
    protected $_params = array('align', 'border', 'bgcolor', 'button', 'class', 'height', 'padding', 'style', 'tabindex', 'width');
    protected $_styles = array('toolbar', 'button', 'menu');
    protected $_scripts = array('toolbar', 'button', 'menu');

    public function add ($object)
    {
        if ($this->is_object($object) && $object->_type == 'button') {
            if ($object->class == "OK_BUTTON") {
                $object->class = $this->button;
            }
            $object->tabindex = $this->tabindex;
            if ($object->menu) {
                $object->class = $this->button . '_MENU';
            }
        }

        parent::add($object);
    }

    protected function _toHTML()
    {
        $ref = $this->client->init('OK_Object_ToolBar', $this->id);
        $this->process_events($ref);

        $p = $this->create('panel');
        $p->id = $this->id;
        $p->class = $this->class;
        $p->border = $this->border;
        $p->width = $this->width;
        $p->height = $this->height;
        $p->padding = $this->padding;
        $p->align = $this->align;
        $p->style = $this->style->toString();
        if ($this->bgcolor) {
            $p->bgcolor = $this->bgcolor;
        }

        $h = $this->create('hbox');
        $h->important = true;
        if ($this->align) { $h->width = ""; }
        $h->setContent($this->content);
        $p->add($h->toHTML());
        $h->destroy();
        unset($h);

        $b = $this->create('button', array(
            'id' => $this->id . '_TBTN',
            'label' => '...',
            'arrow' => 0,
            'width' => "22px",
            'class' => $this->button,
            'tabindex' => -1,
            'disabled' => 0,
            'style' => 'position:absolute;right:4px;top:0px;width:22px;height:100%;display:none;'
        ), array($this->create('menu', array(
            'id' => $this->id . '_TBTN_MENU',
            'onshow' => "ok.route('more', '".$this->id."');"
        ))));
        $p->add($b->toHTML());
        $b->destroy();
        unset($b);

        $output = $p->toHTML();
        $p->destroy();

        return $output;
    }
}
