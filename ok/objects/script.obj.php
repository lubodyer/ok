<?php
/**
 * This file contains the Script OK Object.
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
 * @subpackage Data
 */

/**
 * Script - OK Object
 *
 * @package Objects
 * @subpackage Data
 */
class OK_Object_Script extends OK_Object
{
    /**
     *
     */
    public $_type = 'script';

    /**
     *
     */
    protected $src = "";
    
    /**
     *
     */
    protected $type = 'text/javascript';

    /**
     *
     */
    protected $app_id = "";

    /**#@+
     * Object configuration settings.
     * @access private
     */

    protected $_app_id;
    protected $_params = array('src', 'type', 'app_id');

    protected $_validate = array(
        'src'   => 'string',
        'type'   => 'string',
        'app_id'    => 'string'
    );

    /**#@-*/

    protected function onbeforeload()
    {
        if ($this->engine) {
            $this->_app_id = $this->engine->app_id;
        }
    }

    /**
     *
     *
     */
    protected function _toHTML()
    {
        if ($this->src) {
            if ($this->app_id) {
                $this->_app_id = $this->app_id;
            }

            $GLOBALS['ok']->scripts->add($this->src, $this->_app_id);
        }
        else if ($this->type === 'text/javascript') {
            $this->client->execute($this->content->toHTML());
        } else if ($this->content->length) {
            return sprintf('<script id="%s" type="%s">%s</script>', $this->id, $this->type, $this->content->toHTML());
        }

        return "";
    }
}
