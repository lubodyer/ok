<?php
/**
 * OK Session - OK System Object.
 *
 * OK v.5 - okay-os.com
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
 * @package System
 */

/**
 * Session - OK System Object
 *
 * @package System
 */
final class OK_Session extends OK_Interface
{
    protected $id;
    protected $instance;
    protected $new = false;
    protected $user;

    protected $_previous;
    protected $_readonly = array('id', 'new', 'instance', 'user');

    private $session_data = array();
    private $_saved = false;

    public function __construct($sid = '', $wid = '')
    {
        parent::__construct();

        // ---------------

        if (session_id()) {
            $this->_previous = array(
                'id' => session_id(),
                'name' => ini_get('session.name'),
                'save_path' => ini_get('session.save_path'),
                'use_cookies' => ini_get('session.use_cookies')
            );
            session_commit();
        }

        // ---------------

        $session_name = $this->config->system->session_name;

        ini_set('session.name', $this->config->system->session_name);
        ini_set('session.save_path', OK_DATA . '/sessions');
        ini_set('session.use_cookies', true);
        ini_set('session.cookie_httponly', true);

        if ($sid) {
            $_COOKIE[$session_name] = $sid;
        } elseif (isset($_COOKIE[$session_name])) {
            $sid = $_COOKIE[$session_name];
        } else {
            $this->new = true;
        }

        // ---------------

        if (!session_start()) {
            throw new OK_Exception("Error starting session!");
        }

        $this->id = session_id();

        parent::$_shared['_session'] = $this;

        // ---------------

        if ($this->new || !isset($_SESSION['OK'])) {
            $wid = uniqid('sw');
            $this->instance = new OK_Instance($wid);
            $this->debug("Creating a new instance \"$wid\".", 3);
            $this->session_data['instances'] = array($wid => '');
        } elseif (!$wid) {
            $this->session_data = $_SESSION['OK'];
            $wid = uniqid('sw');
            $this->instance = new OK_Instance($wid);
            $this->session_data['instances'][] = array($wid => '');
        } else {
            $this->session_data = $_SESSION['OK'];
            $instances = $this->session_data['instances'];
            if (!isset($instances[$wid])) {
                $wid = uniqid('sw');
                $this->instance = new OK_Instance($wid);
                $this->session_data['instances'][] = array($wid => '');
                //throw new OK_Exception("Access denied to process request.");
            } else {
                $instance = $instances[$wid];
                $this->instance = unserialize($instance);
            }

            if (!$this->instance) {
                throw new OK_Exception("Error initializing session instance.");
            }
        }

        // --

        if (isset($this->session_data['user'])) {
            $this->user = unserialize($this->session_data['user']);
        }

        if (!$this->user instanceof OK_User) {
            $this->user = new OK_User();
        }
    }

    /**
     *
     */
    public static function get()
    {
       if (!isset(self::$_instance))
           throw new Exception("Session not started.");

       return self::$_instance;
    }

    public static function start()
    {
       if (!isset(self::$_instance))
           self::$_instance = new OK_Session;
    }

    /** */
    public function commit()
    {
        if ($this->_saved) {
            $this->debug("Session already saved!", 5);
            return;
//          throw new Exception("Session already saved.");
        }

        $this->debug("Saving session data.", 3);

        $this->session_data['user'] = serialize($this->user);
        $this->session_data['instances'][$this->instance->id] = serialize($this->instance);

//      $this->debug(session_id());
//      $this->debug(session_name());
//      $this->debug(session_module_name());

        $_SESSION['OK'] = $this->session_data;

        session_commit();

        $this->_saved = true;
    }

    /**#@+
     * @access private
     */

    /** */
    public function __destruct()
    {
        if (!$this->_saved) {
            $this->commit();
        }

        if ($this->_previous) {
            throw new Exception("TODO: Previous session.");
            ini_set('session.name', $this->_config->session->session_name);
            ini_set('session.save_path', OK_DATA . DIRECTORY_SEPARATOR . 'sessions');
            ini_set('session.use_cookies', true);
        }

        unset($this->instance);
        unset($this->user);
        unset(parent::$_shared['_session']);

        parent::__destruct();
    }

    /** */
    public function __toString()
    {
        return $this->id;
    }

    /** */
    public function __sleep()
    {
        return array('id');
    }

    /**#@-*/
}
