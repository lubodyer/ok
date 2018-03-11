<?php
/**
 * This file contains the Spacer OK Object.
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

/** Spacer object extends the Element object. Include the Element object, if not already available. */
if (!class_exists('OK_Object_Element'))
    require_once(dirname(__FILE__) . '/element.obj.php');

/**
 * Spacer - OK Object
 *
 * The Spacer is an object that takes up space but does not display anything.
 *
 * @package Objects
 * @subpackage Interface
 */
class OK_Object_Spacer extends OK_Object_Element
{
    /**
     * Retrieves the string identifying the type of the Object.
     * @var string
     */
    protected $_type = 'spacer';

    /**
     *
     */
    protected $width = '100%';

    /**
     *
     */
    protected $height = '100%';

    /**#@+
     * Object configuration settings.
     * @access private
     */

    protected $value = '';
    protected $extend = false;
    protected $expand = false;
    protected $_accept = null;
    protected $_childof = array('box', 'hbox', 'vbox', 'mainmenu', 'panel');
    protected $_params = array('height', 'width');
    protected $_validate = array(
        'width' => 'int',
        'height' => 'int'
    );

    /**#@-*/

    /**
     *
     *
     */
    protected function _toHTML()
    {
        $this->style->set('font-size', '0px');
//      $this->style->height = $this->height;
//      $this->style->width = $this->width;

        return parent::_toHTML();
    }
}
