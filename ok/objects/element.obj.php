<?php
/**
 * This file contains the Element OK Object.
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
 * Element - OK Object
 *
 * @package Objects
 * @subpackage HTML
 */
class OK_Object_Element extends OK_Object
{
    /**
     * Sets or retrieves the horizontal alignment of the content of the object.
     * @var string
     */
    protected $align;

    /**
     * Retrieves the string identifying the type of the Object.
     * @var string
     */
    protected $_type = 'element';

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
    protected $display;

    /**
     * Sets or retrieves the type of the HTML element.
     * @var string
     */
    protected $element = 'div';

    /**
     *
     */
    protected $expand = true;

    /**
     *
     *
     */
    protected $for;

    /**
     * Sets or retrieves the height of the object.
     * @var length
     */
    protected $height;

    /**
     * Sets or retrieves the position of the object relative to the left edge of the parent object.
     * @var int
     */
    protected $left;

    /**
     * Sets or retrieves the margin between the object and its parent.
     * @var int
     */
    protected $margin = 0;

    /**
     *
     */
    protected $noresize = 0;

    /**
     *
     */
    protected $nochildrenresize = 0;

    /**
     *
     */
    protected $overflow;

    /**
     *
     *
     */
    protected $pack;

    /**
     * Sets or retrieves the padding between the object and the content.
     * @var int
     */
    protected $padding = 0;

    /**
     * Sets or retrieves the position attirbute of the object.
     * @var string
     */
    protected $position;

    /**
     * Sets or retrieves the position of the object relative to the top of the parent object.
     * @var int
     */
    protected $top;

    /**
     * Sets or retrieves the custom style declarations.
     * @var string
     */
    protected $style;

    /**
     * Sets or retrieves the tabulation index of the object.
     * @var int
     */
    protected $tabindex = null;

    /**
     * Specifies whether or not to extend object controller to client-side (if possible).
     * @var boolean
     */
    protected $extend = false;

    /**
     * Sets or retrieves the text value of the object.
     * @var string
     */
    protected $value;

    /**
     * Sets or retrieves whether the object is visible.
     * @var string
     */
    protected $visibility;

    /**
     * Sets or retrieves the width of the object.
     * @var length
     */
    protected $width;

    /**
     * Enables or disables content wrapping.
     *
     * Boolean that specifies or receives one of the following values:
     *
     * - TRUE. Text will never wrap to the next line.
     * - FALSE. Text will wrap when necessary.
     *
     * @var bool
     */
    protected $wrap = true;

    /**#@+
     * Object configuration settings.
     * @access private
     */

    protected $_accept = array();
    protected $_objects = array('style' => 'OK_Style');
    protected $_params = array('align', 'bgcolor', 'element', 'expand', 'display', 'class', 'extend', 'focus', 'for', 'height', 'left', 'margin', 'noresize', 'nochildrenresize', 'overflow', 'pack', 'padding', 'position', 'style', 'tabindex', 'top', 'value', 'visibility', 'width', 'wrap');
    protected $_validate = array(
        'align'             => array('', 'left', 'right', 'center', 'justify'),
        'bgcolor'           => 'string',
        'element'           => array('a', 'canvas', 'div', 'label', 'p', 'span', 'h1', 'h2', 'h3', 'A', 'DIV', 'LABEL', 'SPAN', 'P', 'H1', 'H2', 'H3'),
        'display'           => array('', 'block', 'inline', 'none'),
        'class'             => 'string',
        'extend'            => 'bool',
        'expand'            => 'bool',
        'focus'             => 'bool',
        'for'               => 'string',
        'height'            => 'length',
        'left'              => 'int',
        'margin'            => 'int',
        'noresize'          => 'bool',
        'nochildrenresize'  => 'bool',
        'overflow'          => array('', 'visible', 'hidden', 'scroll', 'auto', 'inherit'),
        'pack'              => 'bool',
        'padding'           => 'int',
        'position'          => array('', 'absolute', 'relative'),
        'style'             => 'string',
        'tabindex'          => 'int',
        'top'               => 'int',
        'value'             => 'string',
        'visibility'        => array('', 'hidden', 'visible'),
        'width'             => 'length',
        'wrap'              => 'bool'
    );

    /**
     * Specifies the elements that can receive focus.
     * @var array
     */
    protected $_canfocus = array();

    /**#@-*/

    /**
     * Retrieves the output of the object.
     * @return string
     */
    protected function _toHTML()
    {
        if ($this->position) {
            $this->style->position = $this->position;
        }
        if ($this->position == 'absolute' || $this->position == 'relative') {
            $this->style->top = $this->top;
            $this->style->left = $this->left;
        }
        if ($this->align) {
            $this->style->set('text-align', $this->align);
        }
        if ($this->display) {
            $this->style->display = $this->display;
        }
        if ($this->visibility) {
            $this->style->visibility = $this->visibility;
        }

        if ($this->width) $this->style->width = $this->width;
        if ($this->height) $this->style->height = $this->height;
        if ($this->margin) $this->style->margin = $this->margin;
        if ($this->padding) $this->style->padding = $this->padding;
        if ($this->bgcolor) $this->style->set('background-color', $this->bgcolor);
        if ($this->overflow) $this->style->set('overflow', $this->overflow);
        if (!$this->wrap) $this->style->set('white-space', 'nowrap');

        // --

        if (empty($this->value)) {
            $this->value = $this->content->toHTML();
        }

        // --

        $output = array();

        $output[] = '<';
        $output[] = $this->element;
        $output[] = ' id="';
        $output[] = $this->id;
        $output[] = '" class="';
        $output[] = $this->class;
        $output[] = '" style="';
        $output[] = $this->style->toString();
        $output[] = '"';

        if ($this->element == 'a')
        {
            $output[] = ' href="';
            $output[] = $this->href;
            $output[] = '"';
            
            if ($this->target) {
                $output[] = ' target="';
                $output[] = $this->target;
                $output[] = '"';
            }
        }

        if ($this->for) {
            $output[] = ' for="';
            $output[] = $this->for;
            $output[] = '"';
        }
        if ($this->align && $this->element == 'div') {
            $output[] = ' align="';
            $output[] = $this->align;
            $output[] = '"';
        }
        if ($this->tabindex !== null) {
            $output[] = ' tabindex="';
            $output[] = $this->tabindex;
            $output[] = '"';
        }

        if ($this->noresize) {
            $output[] = ' data-ok-noresize="1"';
        }
        if ($this->nochildrenresize) {
            $output[] = ' data-ok-nochildrenresize="1"';
        }

        $output[] = '>';
        $output[] = $this->value;
        $output[] = '</';
        $output[] = $this->element;
        $output[] = '>';

        // --

        if ($this->element == "a")
        {
            $ref = $this->client->init('OK_Object_Anchor', $this->id);
            $this->process_events($ref);
        }

        // --

        return implode($output);
    }

}

