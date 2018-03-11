<?php
/**
 * Include - OK Object.
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
 * @subpackage Other
 */

/**
 * Include - OK Object.
 *
 * @package Objects
 * @subpackage Other
 */
class OK_Object_Include extends OK_Object
{
    protected $_type = '';
    protected $_version = '1.0';

    protected $src;

    protected $_params = array('src');
    protected $_validate = array('src' => 'string');

    protected function onload()
    {
        if (!$this->src)
            throw new Exception("Object 'include' requires 'src' attribute.");

        $this->content = $this->ok->load($this->src);
    }

    protected function _toHTML()
    {
        return $this->content->toHTML();
    }
}
