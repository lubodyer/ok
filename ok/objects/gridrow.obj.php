<?php
/**
 * This file contains GridRow OK Object
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
 * GridRow - OK Object
 *
 * @package Objects
 * @subpackage Input
 */
class OK_Object_GridRow extends OK_Object
{
    protected $_type = 'gridrow';

    protected $data = array();

    protected $_accept = array('gridcell');

    protected function _toHTML()
    {
        $cells = array();
        for ($i = 0; $i < $this->content->length; $i++) {
            $cells[] = $this->content->itemToHTML($i);
        }
        $this->content->clear();

        $this->client->call($this->client->get($this->parent->parent->id), 'addrow', $this->client->init("OK_Object_GridRow", $cells));

        return "";
    }
}
