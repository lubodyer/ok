<?php
/**
 * OK v.5 - okay-os.com
 *
 * This file contains the Client OK System Object.
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
 * Client - OK System Object
 *
 * Provides the run-time communicaiton with the client.
 *
 * @package System
 */
final class OK_Client extends OK_Interface
{
    /**
     * Retrieves the full name of the user-agent application.
     * @var string
     */
    protected $agent;

    /**
     * Retrieves whether the client engine is Gecko.
     * @var boolean
     */
    protected $gecko;

    /**
     * Identifies Internet Explorer.
     * @var boolean
     */
    protected $ie;

    /**
     * Retrieves the IP address of the remote machine.
     * @var string
     */
    protected $ip;

    /**
     *
     */
    protected $mobile = false;

    /**
     * Identifies Gecko engine based browser.
     * @var boolean
     */
    protected $moz;

    /**
     *
     */
    protected $name;

    /**
     *
     */
    protected $opera;

    /**
     *
     */
    protected $platform;

    /**
     *
     */
    protected $version;

    /**
     *
     */
    protected $safari;

    /**
     *
     */
    protected $trident;

    /**
     *
     */
    protected $webkit;

    /**#@+
     * @access private
     */

    /**
     * Contains the code to execute on client.
     * @var array
     */
    protected $_buffer = array();

    protected $_params = array('agent', 'gecko', 'ie', 'ip', 'moz', 'name', 'opera', 'platform', 'version', 'safari', 'trident', 'webkit', 'mobile', '_alert');

    protected $_store = null;

    protected $_alert = 'alert';

    /**
     * Contains the server-side references to the client-side objects listed in {@link $_objects}.
     * @var array
     */
    protected $_references = array();

    /**
     * Contains the list of client-side objects either initialized by {@link init()} method or requested by the {@link get()} method.
     * @var array
     */
    protected $_objects = array();

    /**
     * Constructs the object.
     */
    public function __construct()
    {
        parent::__construct();

        // ---------------

        $this->ip = $_SERVER['REMOTE_ADDR'];
        $this->agent = $_SERVER['HTTP_USER_AGENT'];

        // ---------------

        if (preg_match("/win/i", $this->agent))
            $this->platform = "Windows";
        elseif (preg_match("/iPhone/i", $this->agent))
            $this->platform = "iOS";
        elseif (preg_match("/iPad/i", $this->agent))
            $this->platform = "iOS";
        elseif (preg_match("/mac/i", $this->agent))
            $this->platform = "Mac";
        elseif (preg_match("/android/i", $this->agent))
            $this->platform = "Android";
        elseif (preg_match("/linux/i", $this->agent))
            $this->platform = "Linux";
        elseif (preg_match("/OS\/2/i", $this->agent))
            $this->platform = "OS/2";

        // ---------------

        $pattern  = "/([^\/[:space:]]*)(\/([^[:space:]]*))?([[:space:]]*\[[a-zA-Z][a-zA-Z]\])?[[:space:]]*(\\((([^()]|(\\([^()]*\\)))*)\\))?[[:space:]]*/";
        if (preg_match_all($pattern, $this->agent, $matches) !== false)
        {
//          $this->debug($matches);
//          if ($matches[1][0] != "Mozilla" && $matches[1][0] != "Opera") {
//              $this->debug("Request from: " . $this->ip . ", agent: " . $this->agent . '.');
//              throw new Exception("Compatibility Error: Please connect using a Mozilla compatible user-agent.");
//          }

            if (@$matches[1][1] == 'Gecko')
            {
                $this->moz = true;
                $this->gecko = true;
                $this->name = @$matches[1][2];
                $this->version = floatval(@$matches[3][2]);
            }
            elseif (@$matches[1][1] == 'AppleWebKit')
            {
                $this->safari = true;
                $this->webkit = true;
                $this->name = @$matches[1][2];
                $this->version = floatval(@$matches[3][2]);

                if (preg_match("/\(iPhone;/", $this->agent)) {
                    $this->name = "iPhone";
                } else if (preg_match("/\(iPad;/", $this->agent)) {
                    $this->name = "iPad";
                }
            }
            elseif (@$matches[1][0] == 'Opera')
            {
                $this->opera = true;
                $this->name = @$matches[1][0];
                $this->version = floatval(@$matches[3][0]);
            }

            $agent_params = preg_split("/[ \t]*;[ \t]*/", @$matches[6][0]);

            foreach ($agent_params as $param)
            {
                if (($this->gecko || $this->ie) && preg_match("/rv:([0-9\.]+)/", $param, $matches2))
                {
                    $this->version = floatval($matches2[1]);
                }
                elseif (!$this->moz && $agent_params[0] == 'compatible' && preg_match("/MSIE ([0-9\.]+)/", $param, $matches2))
                {
                    $this->ie = true;
                    $this->name = 'MSIE';
                    $this->version = floatval($matches2[1]);
                    $this->trident = true;
                }
                elseif (preg_match("/Trident\/([0-9\.]+)/", $param, $matches2))
                {
                    $this->ie = true;
                    $this->trident = true;
                    $this->name = 'MSIE';
                }
            }

            if (!$this->name) {
//              throw new Exception("Unknown or uncompatible user agent. Please connect using a Mozilla compatible user agent.");
                $this->name = "spider";
            } else if ($this->gecko && version_compare($this->version, 1.8, "<")) {
                $this->debug("Request from: " . $this->ip . ", agent: " . $this->agent . '.');
                throw new Exception("This application requires Gecko revision 1.8 or higher to operate properly.");
            } elseif ($this->ie && version_compare($this->version, 9, "<") && !preg_match("#^/payment#",$_SERVER['REQUEST_URI'])) {
                $this->debug("Request '".$_SERVER['REQUEST_URI']."' from: " . $this->ip . ", agent: " . $this->agent . '.');
                throw new Exception("Your browser is too old. Please update your browser.");
            }

//          foreach ($this->_readonly as $idx => $val) {
//              $this->debug($val . ': ' . $this->$val);
//          }

        } else {
            $this->debug("Request from: " . $this->ip . ", agent: " . $this->agent . '.');
            throw new Exception("System error parsing user-agent.");
        }

        // ---------------

        parent::$_shared['_client'] = $this;

        // --

        $this->mobile = ($this->platform == "iOS" || $this->platform == "Android");

        $this->debug("--> " . ((string) $this->ok->request) . " [ip " . $this->ip . "] [agent " . $this->agent . "]", 0);

        if (!defined('OK_CLIENT_IP')) {
            define('OK_CLIENT_IP', $this->ip);
            define('OK_CLIENT_NAME', $this->name);
            define('OK_CLIENT_VERSION', $this->version);
        }
    }

    /**#@-*/

    /**
     * Alerts the user with a custom message.
     * @param string $sMessage The alert message.
     */
    public function alert($sMessage)
    {
        $sMessage = addslashes($sMessage);
        $this->execute($this->_alert . "(\"$sMessage\");");
    }

    /**
     * Executes a call to object method on client.
     *
     * This function as its first parameter takes a custom reference to the object which can be obtained using the {@link get} or the {@link init} methods.
     *
     * This function generates a warning if the object reference is not valid. In this case no call will be executed at all.
     *
     * @param string $sObjectRef The reference to the client-side object which can be obtained through the {@link get} or the {@link init} methods.
     * @param string $sMethodName The name of the method to execute.
     *
     * @todo explain variable-length arguments
     */
    public function call($sObjectRef, $sMethodName)
    {
//      if ($sObjectRef == 'ok' || $this->is_ref($sObjectRef)) {
            $sParams = '';
            if (func_num_args() > 2) {
                $aParams = array_slice(func_get_args(), 2);
                $sParams = array();
                for ($i = 0, $l = count($aParams); $i < $l; $i++)
                    $sParams[] = $this->_convert($aParams[$i]);
                $sParams = join(',', $sParams);
            }

            $this->execute($sObjectRef . '.' . $sMethodName . "($sParams);");

            return true;
//      }

//      trigger_error("Client object reference \"$sObjectRef\" is not valid (object not initialized?). Call to \"$sMethodName\" not executed.", E_USER_WARNING);
//      return false;
    }

    /**
     * Executes a call to function on client.
     */
    public function callf($sFunctionRef)
    {
        //      if ($sObjectRef == 'ok' || $this->is_ref($sObjectRef)) {
        $sParams = '';
        if (func_num_args() > 1) {
            $aParams = array_slice(func_get_args(), 1);
            $sParams = array();
            for ($i = 0, $l = count($aParams); $i < $l; $i++)
                $sParams[] = $this->_convert($aParams[$i]);
                $sParams = join(',', $sParams);
        }

        $this->execute($sFunctionRef . "($sParams);");

        return true;
    }

    /**
     * Alias to {@link execute()}.
     */
    public function exec($sCustomJsCode)
    {
        $this->execute($sCustomJsCode);
    }

    /**
     * Executes custom JavaScript code on client.
     *
     * Note that the use of this function is discouraged unless you are in need of advanced functionality.
     *
     * @param string $sCustomJsCode The JavaScript code to execute on client.
     * @iname execute-client
     */
    public function execute($sCustomJsCode)
    {
        if ($sCustomJsCode) {
            if ($sCustomJsCode[strlen($sCustomJsCode)-1] != ';')
                $sCustomJsCode .= ';';

            $c = $this->_convert($sCustomJsCode);

            $this->_buffer[] = $sCustomJsCode;
        };
    }

    /**
     * Retrieves a reference to a Object on client, valid for the length of the current request.
     *
     * Note that the object must be created on the server and transfered to the client before you can obtain
     * reference to it.
     *
     * @param string $sObjectID The string identifying the Object.
     */
    public function get($sObjectID)
    {
        if (($key = array_search($sObjectID, $this->_objects)) !== false)
        {
            $sObjectRef = $this->_references[$key];
        }
        else
        {
            $sObjectRef = $this->_createRef();
            $this->_objects[] = $sObjectID;
            $this->_references[] = $sObjectRef;

            $this->execute("$sObjectRef = " . 'ok.get' . "('$sObjectID');");
        }

        return $sObjectRef;
    }

    /**
     * Initializes a custom object on client.
     *
     * Initializes a client-side JavaScript object in a temporary variable and returns a reference, which is valid for the length
     * of the current request.
     *
     * This function is of particular interest to developers of Objects or if you are using custom JavaScript objects
     * that you need to initialize. In either case the library files must be transfered to client using the {@link load()} method.
     *
     * Very important is to note that the new object instance will be valid only for the length of the request and the reference
     * will be destroyed after that. Client-side Objects extending the base {@link OK_Object} class must use the
     * 'register' method to register themself with the {@link OK_Objects} collection. If you are developing a custom JS
     * object and you want it to persist be sure to create a reference to it somewhere or it will be gone after the script
     * finishes its execution.
     *
     * @param string $sObjectName The name of the JavaScript object to initialize.
     * ---@param mixed $mParams Individual parameter or an array of parameters to pass to object constructor.
     *
     * @return string Reference to the new object that you can use with the {@link call()} or {@link set()} methods.
     *
     * @todo Explain variable-length attributes
     */
    public function init($sObjectName)
    {
        if (!isset($this->_objects[$sObjectName]))
        {
            $sObjectRef = $this->_createRef();
            $this->_objects[] = $sObjectName;
            $this->_references[] = $sObjectRef;

            $sParams = '';
            if (func_num_args() > 1) {
                $aParams = array_slice(func_get_args(), 1);
                $sParams = array();
                for ($i = 0, $l = count($aParams); $i < $l; $i++)
                    $sParams[] = $this->_convert($aParams[$i]);
                $sParams = join(',', $sParams);
            }

            $this->_buffer[] = "$sObjectRef = new " . $sObjectName . "($sParams);";
            return $sObjectRef;
        } else
            trigger_error("Client object \"$sObjectName\" already initialized.", E_USER_NOTICE);
        return false;
    }

    /**
     *
     *
     */
    public function is_ref($sRef)
    {
        return in_array($sRef, $this->_references);
    }

    /**
     * Executes custom Javascript code without any checks. Use with care!
     *
     */
    public function passthru ($sJSCode)
    {
        $this->_buffer[] = $sJSCode;
    }

    /**
     *
     *
     */
    public function restore()
    {
        if ($this->_store !== null) {
            $this->_buffer = $this->_store[0];
            $this->_objects = $this->_store[1];
            $this->_references = $this->_store[2];
            $this->_store = null;
        }
    }

    /**
     *
     *
     */
    public function set($sObjectRef, $sParamName, $mParamValue)
    {
//      if ($sObjectRef == 'ok' || $this->is_ref($sObjectRef)) {
            $this->execute($sObjectRef . '.' . $sParamName . '=' . $this->_convert($mParamValue));
//      }
    }

    /**
     *
     *
     */
    public function store()
    {
        $this->_store = array(
            $this->_buffer,
            $this->_objects,
            $this->_references
        );

        $this->_buffer = array();
        $this->_objects = array();
        $this->_references = array();
    }

    /**
     * Attempts to trigger an event on the client.
     *
     * @param reference $sObjectRef Reference to the client-side object previously obtained with {@link get()}.
     * @param string $sEventName The name of the event.
     *
     * @return boolean True on success. False if the reference is not valid.
     */
    public function fire($sObjectRef, $sEventName)
    {
        if ($this->is_ref($sObjectRef)) {
            $sEventName = preg_replace("/^on/", "", $sEventName);
            $this->execute("ok.events.route({type:'$sEventName'}, $sObjectRef);");
            return true;
        }
        return false;
    }

    /**
     *
     *
     */
    protected function _convert($param)
    {
        if (is_array($param)) {
            if (array_values($param) === $param) {
                $output = array();
                foreach ($param as $p) {
                    $output[] = $this->_convert($p);
                }
                return '[' . join(',', $output) . ']';
            } else {
                $output = "";
                foreach ($param as $k => $v) {
                    if (strlen($output)) {
                        $output .= ",";
                    }
                    $output .= '"' . $k . '":' . $this->_convert($v);
                }
                return '{' . $output . '}';
            }
        } elseif (is_bool($param))
            return $param ? 'true' : 'false';
        elseif (is_null($param))
            return 'null';
        elseif (is_numeric($param))
            return $param;
        elseif (OK_Validate::is_regexp($param))
                return $param;
        elseif (is_string($param)) {
            if ($this->is_ref($param))
                return $param;
            if (preg_match("/[\r\n]/", $param)) {
                $param = preg_replace("/\]/", "\]", preg_replace("/\[/", "\[", preg_replace("/\n/", "\\n", preg_replace("/\r/", "\n", preg_replace("/\r\n/", "\n", $param)))));
                return '"' . addslashes($param) . '".replace(/\\\n/g, "\n").replace(/\\\\\[/g, "[").replace(/\\\\\]/g, "]")';
            } else
                return '"' . addslashes($param) . '"';
        }

        trigger_error("Unable to convert param \"$param\".", E_USER_WARNING);

        return EMPTY_STRING;
    }

    /**
     *
     *
     */
    protected function _createRef()
    {
        $ref = $this->uniqid('js');
        return $ref;
    }

    /**
     *
     * @iaccess private
     */
    public function _get($clean = false)
    {
        $output = "";

        if ($this->_buffer) {
            if ($this->_references) foreach ($this->_references as $key => $val) {
                $this->_buffer[] = "delete $val;";
            }
            $output = implode("\n", $this->_buffer);
        }

        if ($clean) {
            $this->_buffer = array();
            $this->_objects = array();
            $this->_references = array();
        }

        return $output;
    }

}
