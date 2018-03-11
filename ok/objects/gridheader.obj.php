<?php
/**
 * This file contains GridHeader OK Object.
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
 * GridHeader - OK Object
 *
 * Represents the header of a {@link OK_Object_Grid}. Must be a child of a grid. Accepts
 * children of type {@link OK_Object_GridCol}.
 *
 * @package Objects
 * @subpackage Input
 */
class OK_Object_GridHeader extends OK_Object
{
    protected $_type = 'gridheader';

    protected $style;

    protected $_accept = array('gridcol');
    protected $_objects = array('style' => 'OK_Style');
    protected $_params = array('style');

    protected function _toHTML()
    {
        $header = $this->create('div', array(
            'id' => $this->parent->id . ':HEADER',
            'class' => $this->parent->class . '_HEADER',
            'display' => 'none',
            'style' => $this->style->toString()
        ));

        $header->setContent($this->content);

        return $header->toHTML();
    }

}

