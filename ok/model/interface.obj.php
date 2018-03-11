<?php
/**
 * OK v.5 - okay-os.com
 *
 * Abstract Object - OK System Object.
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
 * Object - OK System Object
 *
 * This is the abstract base class for the entire OK Object Model. This object does not expose
 * public properies or methods.
 *
 * {@internal This class allows child classes to protect their read-only properties from modification by
 * declaring them protected and listing them in a protected array $_readonly. Access to these variables will
 * be provided as if they were public. This class uses the __get and __set magic functions. Both top-level
 * OK objects OK_Server and OK_Object are descendants of this class.}}
 *
 * @package System
 */
abstract class OK_Interface
{
    /**
     *
     *
     */
    private static $_active = 0;

    /**
     *
     *
     */
    private static $_created = 0;

    /**
     *
     *
     */
    private $_core = array(
        'OK'        => 1,
        'Cache'     => 1,
        'Client'    => 1,
        'Dialogs'   => 1,
        'Images'    => 1,
        'Instance'  => 1,
        'Items'     => 1,
        'Model'     => 1,
        'Object'    => 1,
        'Program'   => 1,
        'Request'   => 1,
        'Response'  => 1,
        'Runtime'   => 1,
        'Session'   => 1,
        'Script'    => 1,
        'Thread'    => 1,
        'User'      => 1
    );

    /**
     *
     *
     */
    private $_constructed = false;

    /**
     *
     *
     */
    private static $_debug = 0;

    /**
     *
     */
    private static $_debug_buffer = array();

    /**
     *
     */
    private static $_debug_memory = false;

    /**
     *
     *
     */
    private static $_debug_script = false;

    /**
     *
     *
     */
    private static $_debug_started = false;

    /**
     *
     *
     */
    private static $_debug_stamp = 0;

    /**
     *
     *
     */
    private static $_destroyed = 0;

    /**
     *
     *
     */
    private static $_max = 0;

    /**
     * Child objects can use this property to describe validation of semi-public properties.
     * @var array
     */
    protected $_params = array();

    /**
     * An array containing the names of the read-only class parameters.
     * @var array
     */
    protected $_readonly = array();

    /**
     *
     */
    private $_share = array(
        'cache'     => 1,
        'client'    => 1,
        'config'    => 1,
        'engine'    => 1,
        'session'   => 1,
        'ok'    => 1
    );

    /**
     * An array referencing the shared system objects.
     * @var array
     */
    protected static $_shared = array();

    /**
     * Child objects can use this array to describe how their properties are to be validated.
     * @var array
     */
    protected $_validate = array();

    // --

    /**
     *
     */
    protected $_params_ = array();

    /**
     *
     */
    protected $_readonly_ = array();

    /**
     *
     * @access protected
     */
    protected function __construct()
    {
        if ($this->_constructed)
        {
            throw new Exception("Access denied to reconstruct object.");
        }

        $this->_constructed = true;

        // --

        if (self::$_debug_memory === null) {
            self::$_debug_memory = memory_get_usage();
        };

        // --

        foreach ($this->_params as $entry) {
            $this->_params_[$entry] = 1;
        }

        foreach ($this->_readonly as $entry) {
            $this->_readonly_[$entry] = 1;
        }

        // -------------

        self::$_created++;
        self::$_active++;
        if (self::$_active > self::$_max) {
            self::$_max = self::$_active;
        }

        $this->debug("[". self::$_created . "/" . self::$_destroyed . "/" . self::$_active . "] Constructed.", 8);
    }

    // -----------

    /**
     *
     * @access private
     */
    protected function get_name($object = null)
    {
        if (!is_object($object))
            if (isset($this))
                $object = $this;
            else
                return false;

        if ($object instanceof OK_Object)
            return $object->_type;
        elseif ($object instanceof OK_Extras)
            return ucfirst($object->_type);

        return preg_replace("/^OK_/", '', get_class($object));
    }

    /**
     *
     */
    final protected function share ()
    {

    }

    /**
     *
     */
    protected function shared($name)
    {
        $name = '_' . $name;
        if (isset(self::$_shared[$name])) {
            //$this->debug("Sharing $name...");
            return self::$_shared[$name];
        }
        return false;
    }

    /**
     * Log message to the debug log.
     *
     * @param string $message The message
     * @param int $level (optional) Severity level
     * @param string $module (optional) Module
     * @param bool $force_save (optional) Force save
     */
    protected function debug($message, $level = 0, $module = null, $force_save = false)
    {
        if (self::$_debug < $level)
            return;

        if (is_null($module))
        {
            $trace = debug_backtrace();
            if (isset($trace[1]['class']))
                $module = strtolower($this->get_name($trace[1]['class']));
            else
                $modules = 'unknown';
        }

        if ($module == 'engine')
            $module = 'program';

        if (strlen($module) < 10)
            $module = str_pad($module, 10, ' ');
        elseif (strlen($module) > 10)
            $module = substr($module, 0, 10);

        $now = @date('d-M-Y H:i:s');

        if (gettype($message) != 'string')
            $message = preg_replace("/\n/", "", print_r($message, 1));

        if (self::$_debug_memory) {
            $memory = sprintf("% 4dKB", round((memory_get_usage() - self::$_debug_memory) / 1024));
        }

        $stamp = $this->stamp();
        $tick = self::$_debug_stamp ? $stamp - self::$_debug_stamp : 0;
        $_tick = sprintf("%01.4f", $tick);
        self::$_debug_stamp = $stamp;

        $ttick = $tick > 0.05 ? "[*]" : "[ ]";


        if (self::$_debug_memory) {
            $message = "[$now] $ttick [$_tick] [$memory] [" . OK_REQUEST_ID . "] [$level] [$module] $message";
        } else {
            $message = "[$now] $ttick [$_tick] [" . OK_REQUEST_ID . "] [$level] [$module] $message";
        }

        self::$_debug_buffer[] = $message;
//      if (count(self::$_debug_buffer) > 50) {
//          $force_save = true;
//      }

        if ($force_save)
            $this->_save_debug_buffer();
    }

    /**
     *
     *
     */
    protected function stamp()
    {
        list($usec, $sec) = explode(" ", microtime());
        return ((float) $usec + (float) $sec);
    }

    /**
     *
     */
    protected function trace($message = "unnamed trace")
    {
        $this->debug("--------------", 1, 'TRACE', true);
        $this->debug("Trace: $message", 0, 'TRACE', true);

        $trace = debug_backtrace(false);
        array_shift($trace);

        for ($i = 0, $l = count($trace); $i<$l; $i++)
        {
            $ts = "";
            if (isset($trace[$i]['class'])) $ts .= $trace[$i]['class'];
            if (isset($trace[$i]['type'])) $ts .= $trace[$i]['type'];
            if (isset($trace[$i]['function'])) $ts .= $trace[$i]['function'];

            if (isset($trace[$i]['args'])) {
                $ts .= "(";
                for ($m=0, $k = count($trace[$i]['args']); $m<$k; $m++)
                {
                    $ts .= ($m > 0 ? ", " : "");
                    if (is_string($trace[$i]['args'][$m]))
                        $ts .= "\"" . $trace[$i]['args'][$m] . "\"";
                    elseif (is_numeric($trace[$i]['args'][$m]))
                        $ts .= $trace[$i]['args'][$m];
                    elseif (is_object($trace[$i]['args'][$m]))
                        $ts .= "<<object>>";
                    else
                    $ts .= "<<unknown>>";
                }
                $ts .= ")";
            }

            if (isset($trace[$i]['file'])) {
                $ts .= " in " . $trace[$i]['file'] . ' on ' . $trace[$i]['line'];
            }

            $this->debug("[BACKTRACE:$i] $ts", 0, 'TRACE', true);
        }
    }

    /**
     * Generates dashes stripped RFC 4211 COMPLIANT Universally Unique IDentifiers (UUID) version 4.
     * @param string salt
     */
    protected function uniqid($salt = "")
    {
        return $salt . sprintf('%04x%04x%04x%04x%04x%04x%04x%04x',

          // 32 bits for "time_low"
          mt_rand(0, 0xffff), mt_rand(0, 0xffff),

          // 16 bits for "time_mid"
          mt_rand(0, 0xffff),

          // 16 bits for "time_hi_and_version",
          // four most significant bits holds version number 4
          mt_rand(0, 0x0fff) | 0x4000,

          // 16 bits, 8 bits for "clk_seq_hi_res",
          // 8 bits for "clk_seq_low",
          // two most significant bits holds zero and one for variant DCE1.1
          mt_rand(0, 0x3fff) | 0x8000,

          // 48 bits for "node"
          mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
        //return md5($salt . microtime(1));
    }

    // -----------------

    /**
     * Saves the debug buffer to file.
     * @access private
     */
    private function _save_debug_buffer()
    {
        if (!defined('OK_DATA'))
            return;

        if (self::$_debug_buffer) {

            $log_file = OK_DATA . '/log/ok.log';

            $fp = fopen($log_file, "a");
            if (!$fp)
                throw new Exception("There was an error creating log file.");

            // ----------------

            while (true) {
                if (flock($fp, LOCK_EX))
                    break;
                $k = rand(0, 20);
                usleep(round($k * 10000));
            }

            // ----------------

            if (self::$_debug > 1 && filesize($log_file) > 0)
                if (!self::$_debug_started)
                    array_unshift(self::$_debug_buffer, '-----------------');

            // ----------------

            fwrite($fp, join("\n", self::$_debug_buffer) . "\n");
            fclose($fp);

            // ----------------

            self::$_debug_started = true;
            self::$_debug_buffer = array();
        }
    }

    // -----------------

    /**
     *
     * @access private
     */
    public function __clone()
    {
        throw new Exception("Clone not allowed.");
    }

    /**
     *
     * @access private
     */
    public function __destruct()
    {
        self::$_active--;
        self::$_destroyed++;

        $this->debug("[". self::$_created . "/" . self::$_destroyed . "/" . self::$_active . "] Destructed \"" . $this->get_name($this) . "\"", 8, '');

        if (self::$_active == 0) {

            if ($this instanceof OK)
            {
                $this->debug("Clean shutdown. Total objects: ". self::$_created . ", peak: " . self::$_max . ".", 2);
                $this->debug(sprintf("Request executed in: %0.4f second(s).", $this->_stats['finished'] - $this->_stats['started']), 1);
            }
            else
            {
                $this->debug("Not clean shutdown (last module must be OK)", 2);
                $this->debug("Total objects: ". self::$_created . ", peak: " . self::$_max . ".", 2);
                $this->debug("Peak memory usage: " . round(memory_get_peak_usage() / 1024) . "KB", 3);
            }

            $this->_save_debug_buffer();
        }

    }

    /**
     * Magic functionality to control access to object properties.
     * @param string $name Property name
     * @return mixed Property value
     * @access private
     */
    public function __get($name)
    {
        if (isset($this->_params_[$name]) || isset($this->_readonly_[$name]))
        {
            if (isset($this->$name))
            {
                return $this->$name;
            }
            return null;
        }
        elseif (!property_exists($this, $name) && isset($this->_share[$name]))
        {
            if (isset(self::$_shared['_' . $name])) {
                return self::$_shared['_' . $name];
            }
            return null;
        }

        $this->debug("Unexisting parameter \"".$this->get_name($this).".$name\".");
        throw new Exception("Access denied validation violation: {$this->get_name($this)}.$name");
    }

    /**
     *
     * @access private
     */
    public function __isset($name)
    {
        if ((isset($this->_params_[$name]) || isset($this->_readonly_[$name])) && isset($this->$name))
        {
            return true;
        }
        return false;
    }

    /**
     * Magic functionality to control assignment of object properties.
     * @param string $name Property name.
     * @param mixed $value Property value.
     * @access private
     */
    public function __set($name, $value)
    {
        if (isset($this->_readonly_[$name]))
        {
            $this->$name = $value;
        }
        elseif (isset($this->_params_[$name]))
        {
            $context = 'string';
            if (isset($this->_validate[$name]))
            {
                $context = $this->_validate[$name];
                if (!OK_Validate::is_valid($value, $context)) {
                    throw new Exception(sprintf("Illegal value \"%s\" for object parameter \"%s.%s\" in context \"%s\".", is_object($value) ? get_class($value) : is_array($value) ? 'Array' : $value, $this->get_name(), $name, $context), E_USER_WARNING);
                }
            }

            if (OK_Validate::is_bool($value, $context))
            {
                $this->$name = OK_Validate::is_true($value) ? true : false;
            }
            else
            {
                $this->$name = $value;
            }
        }
        elseif (!property_exists($this, $name))
        {
            trigger_error(sprintf("Failed to set \"%s.%s\" to \"%s\".", $this->get_name(), $name, is_object($value) ? get_class($value) : $value), E_USER_WARNING);
        }
    }
}
