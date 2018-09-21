<?php
/**
 * OK - Provides access to OK API.
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

/** */
define('OK_REQUEST_ID', uniqid('req'));

/** */
define('OK_VERSION', 5.2);

// --

/** Require the master interface */
require_once dirname(__FILE__) . DIRECTORY_SEPARATOR . 'interface.obj.php';

// --

/**
 * OK - Provides access to OK API.
 *
 * @package System
 */
final class OK extends OK_Interface
{
    /**#@+
     * OK Status Constants.
     * @see OK::$_status
     * @access private
     */
    const NOT_STARTED = 1;
    const INITIALIZING = 2;
    const INITIALIZED = 3;
    const EXECUTING = 4;
    const PREPARING = 5;
    const FINISHED = 6;
    /**#@-*/

    const LAYOUT_REPLACE_CONTENT = 1;
    const LAYOUT_INSERT_AFTER = 2;
    const LAYOUT_APPEND_CHILD = 3;

    const FILTER_SCRIPT = '/\burl\(([a-z0-9\.\_\-\/]+)\)/i';
    const FILTER_STYLE = '/(?:\$([a-z0-9_]+))|(?:url\((?:\"|\')?([^\/\\"\')]+)(?:\"|\')?\))/i';

    /**
     * Retrieves reference to the active {@link OK_Runtime}.
     * @var OK_Runtime
     */
    public $app;

    /**
     * Retrieves reference to the {@link OK_Cache} system cache object.
     * @var OK_Cache
     */
    protected $cache;

    /**
     * Retrieves reference to the {@link OK_Client} object.
     * @var OK_Client
     */
    protected $client;

    /**
     * Retrieves reference to system configuration object.
     * @var object
     */
    public $config;

    /**
     * Retrieves reference to the main {@link OK_Collection content collection}.
     * @var OK_Collection
     */
    public $content;

    /**
     * Retrieves a reference to the {@link OK_Objects} collection.
     * @var OK_Objects
     */
    public $objects;

    /**
     *
     * @var array
     */
    protected $errors = array();

    /**
     * Retrieves reference to the fonts {@link OK_Items items container} object.
     * @var OK_Items
     */
    protected $fonts;


    /**
     * Retrieves reference to the image {@link OK_Images items container} object.
     * @var OK_Images
     */
    protected $images;

    /**
     * Contains reference to the {@link OK_Request request} object.
     * @var object
     */
    public $request;

    /**
     * Contains reference to the {@link OK_Response response} object.
     * @var OK_Response
     */
    public $response;

    /**
     * Retrieves reference to the {@link OK_Session session} object.
     * @var OK_Session
     */
    protected $session;

    /**
     * Retrieves reference to the script {@link OK_Items items container} object.
     * @var OK_Items
     */
    protected $scripts;

    /**
     * Retrieves reference to the request {@link OK_Status status} object.
     * @var OK_Status
     */
    protected $status;

    /**
     * Retrieves reference to the style {@link OK_Items items container} object.
     * @var OK_Items
     */
    protected $styles;

    /**
     * Retrieves the string identifying OK version.
     * @var string
     */
    protected $version = OK_VERSION;

    /**
     *
     */
    protected $user;

    /**
     *
     */
    protected $xml;

    /**#@+
     * @access private
     */

    /** @var array */
    protected $_buffer = array();
    /** @var int */
    protected $_buffer_level = 0;
    /** */
    protected $_content = null;
    /** @var object */
    protected $_dialogs;
    /** */
    protected $_images = null;
    /** @var object */
    protected static $_instance;
    /** */
    protected $_model = array (
        'collection',
        'cache',
        'command',
        'events',
        'objects',
        'queue',
        'keyboard',
        'touch',
        'request',
        'response',
        'layout',
        'drag',
        'ok',
        'canvas',
        'css',
        'functions',
        'fx',
        'object',
        'dialog'
    );
    /** @var bool */
    protected $_protected = false;
    /** */
    protected $_scripts = null;
    /** @var array */
    protected $_stats = array();
    /** @var int */
    protected $_status = self::NOT_STARTED;
    /** @var array */
    protected $_readonly = array('app', 'cache', 'client', 'content', 'errors', 'fonts', 'images', 'request', 'service_id', 'response', 'session', 'scripts', 'status', 'styles', 'version', '_dialogs', '_protected', '_status', '_model');
    /** @var bool */
    protected $_sent = false;

    /** */
    protected function __construct()
    {
        $this->_stats['started'] = $this->stamp();
        $this->_status = self::INITIALIZING;

        // --

        if (!defined('OK_ROOT')) {
            define('OK_ROOT', realpath(dirname(dirname(__FILE__))));
        }

        if (!is_dir(OK_ROOT)) {
            throw new Exception("Access denied to root directory.");
        }

        define('OK_DIR', dirname(OK_ROOT));

        // --

        $model = OK_ROOT . DIRECTORY_SEPARATOR . 'model' . DIRECTORY_SEPARATOR;

        require_once $model . 'config.obj.php';
        require_once $model . 'client.obj.php';
        require_once $model . 'cache.obj.php';
        require_once $model . 'request.obj.php';
        require_once $model . 'session.obj.php';
        require_once $model . 'instance.obj.php';
        require_once $model . 'user.obj.php';
        require_once $model . 'exception.obj.php';
        require_once $model . 'validate.obj.php';

        // --

        $config = OK_ROOT . '/ok.ini';
        parent::$_shared['_config'] = $this->config = new OK_Config($config);

        if (defined('OK_CONFIG') && OK_CONFIG !== $config) {
            $config = "";
            if (defined("OK_CONFIG_LOCAL")) {
                $config = OK_CONFIG_LOCAL;
            }
            $this->config->load(OK_CONFIG, $config);
        }
        unset($config);

        // --

        parent::__construct();

        self::$_shared['_ok'] = $this;

        // --

        if (!defined('OK_PROGRAMS')) {
            $programs = $this->config->ok->programs;
            if (!$programs || $programs === 'auto') {
                $programs = realpath(OK_DIR . '/programs');
            }
            define('OK_PROGRAMS', $programs);
            unset($programs);
        }

        if (!is_dir(OK_PROGRAMS)) {
            throw new Exception("Access denied to programs directory.");
        }

        if (!defined('OK_DATA')) {
            $data = $this->config->ok->data;
            if (!$data || $data === 'auto') {
                $data = OK_ROOT . realpath(OK_DIR . '/.ok');
            }
            define('OK_DATA', $data);
            unset($data);
        }

        if (!is_dir(OK_DATA)) {
            throw new Exception("Access denied to data directory.");
        }

        if (!is_dir(OK_DATA . '/log') && !mkdir(OK_DATA . '/log', 0777, true)) {
            throw new Exception("Access denied to create log directory.");
        }

        if (!is_dir(OK_DATA . '/sessions') && !mkdir(OK_DATA . '/sessions', 0777, true)) {
            throw new Exception("Access denied to create log directory.");
        }

        define('OK_TEMP', OK_DATA . '/temp');
        if (!is_dir(OK_TEMP) && !mkdir(OK_TEMP, 0777, true)) {
            throw new Exception("Access denied to create temporary directory.");
        }

        // --

        if (!ini_get('date.timezone') && !getenv('TZ')) {
            date_default_timezone_set(@date_default_timezone_get());
        }

        ini_set("date.timezone", $this->config->system->default_timezone);
        date_default_timezone_set($this->config->system->default_timezone);

        ini_set('html_errors', false);
        ini_set('display_errors', true);
        ini_set('log_errors', OK_DATA . '/log/error.log');
        ini_set('error_prepend_string', '<ok><phperror>');
        ini_set('error_append_string', "</phperror></ok>\n");
        set_error_handler(array($this, '__error'));
        set_exception_handler(array($this, '__exception'));
        libxml_use_internal_errors(true);
        ob_implicit_flush(true);

        // ---

        $sid = '';
        $wid = '';

        if (isset($_REQUEST['ok']))
        {
            $this->request = OK_Request::decode($_REQUEST['ok']);

            if (!$this->request instanceof OK_Request) {
                throw new OK_Exception("Invalid request.");
            }

//          if (!$this->request->sid || !$this->request->wid) {
//              throw new OK_Exception("Unsupported request type.");
//          }

            $sid = $this->request->sid;
            $wid = $this->request->wid;

            $this->_status = self::INITIALIZED;
            unset($_GET['ok']);
            unset($_REQUEST['ok']);
            unset($_POST['ok']);
        }

        $this->_protected = true;
        $this->session = new OK_Session($sid, $wid);

        if (!$this->request) {
            if (!defined("OK_RUN")) {
                define("OK_RUN", $this->config->ok->run);
            }
            $this->request = new OK_Request(OK_RUN);
        }

        // --

        $this->_protected = false;

        // --

        $GLOBALS['ok'] = $GLOBALS['OK'] = $this;

        // --

        $this->debug("Processing request: " . (string) $this->request, 1);

        // --

        try {
            $this->client = new OK_Client();
        } catch (Exception $x) {
            echo $x->getMessage();
            $this->debug($x->getMessage(), 0, "FATAL", 1);
            define('OK_FATAL_ERROR', 1);
            return;
        };

        // --

        require_once $model . 'runtime.obj.php';
        require_once $model . 'collection.obj.php';
        require_once $model . 'object.obj.php';
        require_once $model . 'objects.obj.php';
        require_once $model . 'items.obj.php';
        require_once $model . 'dialogs.obj.php';
        require_once $model . 'fonts.obj.php';
        require_once $model . 'images.obj.php';
        require_once $model . 'model.obj.php';
        require_once $model . 'program.obj.php';
        require_once $model . 'response.obj.php';
        require_once $model . 'status.obj.php';
        require_once $model . 'style.obj.php';
        require_once $model . 'thread.obj.php';

        // --

        $this->response = new OK_Response();
        $this->cache = new OK_Cache();
        $this->content = new OK_Collection();
        $this->objects = new OK_Objects();
        $this->fonts = new OK_Fonts();
        $this->images = new OK_Images();
        $this->scripts = new OK_Items('script');
        $this->styles = new OK_Items('style');
        $this->_dialogs = new OK_Dialogs();
        $this->status = new OK_Status();

        // --

        $this->_stats['initialized'] = $this->stamp();

        // --

        $this->_buffer_level = ob_get_level();
        ob_start(array($this, '___output'), 2);
        $this->_execute($this->request);
        $this->_send();

        unset($GLOBALS['ok']);
        unset($GLOBALS['OK']);
    }

    /**#@-*/

    /**
     * Adds Object to {@link OK_Response Response}.
     * @param object $object The object to add
     */
    public function add($object)
    {
        return $this->content->add($object);
    }

    /**
     *
     */
    public function clear()
    {
        $this->response = new OK_Response();
        $this->cache = new OK_Cache();
        $this->content = new OK_Collection();
        $this->objects = new OK_Objects();
        $this->fonts = new OK_Fonts();
        $this->images = new OK_Images();
        $this->scripts = new OK_Items('script');
        $this->styles = new OK_Items('style');
        $this->_dialogs = new OK_Dialogs();
    }

    /**
     * Creates OK Object.
     * @param string $sObjectName The name of the object.
     * @param array $aParams (optional) Array of object parameters.
     * @param array $aObjects (optional) Array of child objects.
     * @param array $bRegister (optional) Whether or not to register the object with the {@link OK_Objects objects collection}.
     * @param array $bAddToResponse Whether or not to add the object to {@link OK_Response response}.
     */
    public function create($sObjectName, $aParams = array(), $aObjects = array(), $bRegister = true, $bAddToResponse = false)
    {
        return $this->objects->create($sObjectName, $aParams, $aObjects, $bRegister, $bAddToResponse);
    }

    /**
     * Creates a valid request to OK Server.
     *
     */
    public function create_request($command, array $params = array())
    {
        $r = new OK_Request($command, $params);

        if (!$this->config->system->landing) {
            $this->config->system->landing = $_SERVER['REQUEST_URI'];
        }

        return $this->config->system->landing . '?' . $this->config->system->request_var_name . '=' . $r->encode();
    }

    /**
     *
     *
     */
    public function debug($message, $level = 0, $module = null, $force_save = false)
    {
        parent::debug($message, $level, $module, $force_save);
    }

    /**
     * Decodes text previously encoded with {@link encode()}.
     * @param string $sText Text to decode.
     * @return string Decoded text.
     */
    public function decode($sText)
    {
        return base64_decode(str_replace("-", "+", str_replace(";", "/", $sText)));
    }

    /**
     * Web-safe version of base64 text encoding.
     *
     * @see decode()
     * @param string $sText Text to encode.
     * @return string Encoded text.
     */
    public function encode($sText)
    {
        return str_replace("+", "-", str_replace("/", ";", base64_encode($sText)));
    }

    /**
     *
     */
    public function execute($command, array $params = array())
    {
        $this->_execute(new OK_Request($command, $params));
    }

    /**
     *
     */
    public function fetch($command, $params = array(), $xml = false)
    {
        return $this->_fetch(new OK_Request($command, $params), $xml);
    }

    /**
     *
     *
     */
    public function get($sObjectID)
    {
        return $this->objects->get($sObjectID);
    }

    /**
     *
     *
     */
    public function load($xml, $bAddToResponse = false)
    {
        $_xml = new DOMDocument('1.0', 'utf-8');
        $_xml->loadXML($xml);

        $errors = libxml_get_errors();
        if (count($errors)) {
            foreach ($errors as $error) {
                $this->debug($error);
                $error_type = E_USER_ERROR;
                switch ($error->level) {
                    case LIBXML_ERR_WARNING:
                        $error_type = $E_USER_WARNING;
                    default:
                        trigger_error("XML PARSER: " . preg_replace("/\n/", "", $error->message) . " in " . $error->file . ' on line ' . $error->line . ", col " . $error->column . "." , $error_type);
                }
            }
        }

        // Validate OK XML root tag
        if ($_xml->documentElement->tagName != "ok") {
            trigger_error("Error parsing XML: Interface files must start with \"ok\" tag.", E_USER_ERROR);
        }

        // Locate interface section
        $nodelist = $_xml->documentElement->getElementsByTagName("interface");
        $interface = $nodelist->item(0);
        if (!$interface) {
            trigger_error("Error parsing service \"$service_id\". Missing interface section.", E_USER_ERROR);
        }

        $output = new OK_Collection;
        for ($i=0; $i<$interface->childNodes->length; $i++) {
            $this->_load($interface->childNodes->item($i), $output, $bAddToResponse);
        }

        return $output;
    }

    /**
     *
     */
    protected function _load($node, $collection, $bAddToResponse = false)
    {
        switch ($node->nodeType)
        {
            case XML_ELEMENT_NODE:
                $params = array();
                for ($i = 0; $i < $node->attributes->length; $i++) {
                    $attribute = $node->attributes->item($i)->name;
                    $value = preg_replace_callback(OK::FILTER_STYLE, array($this, '____style'), $node->attributes->item($i)->value);
                    $params[$attribute] = $value;
                }

                $object = $this->create($node->tagName, $params, array(), true);

                if ($bAddToResponse) {
                    $this->ok->add($object);
                }

                for ($i=0; $i<$node->childNodes->length; $i++)
                    $this->_load($node->childNodes->item($i), $object);

                $collection->add($object);
                break;

            case XML_CDATA_SECTION_NODE:
            case XML_TEXT_NODE:
                $value = ltrim($node->nodeValue);
                if (!empty($value))
                    $collection->write($value);
                break;
        }
    }

    /** */
    public function restoreContent()
    {
        if ($this->_content !== null) {
            $this->content  = $this->_content[0];
            $this->objects = $this->_content[1];
            $this->fonts    = $this->_content[2];
            $this->images   = $this->_content[3];
            $this->scripts  = $this->_content[4];
            $this->styles   = $this->_content[5];
            $this->_dialogs = $this->_content[6];
            $this->_content = null;
            return true;
        }
        return false;
    }

    /**
     *
     */
    public static function start()
    {
       if (!isset(self::$_instance))
           self::$_instance = new OK();
       else
           throw new Exception("Already started.");

       return true;
    }

    /** */
    public function storeContent()
    {
        $this->_content = array(
            $this->content,
            $this->objects,
            $this->fonts,
            $this->images,
            $this->scripts,
            $this->styles,
            $this->_dialogs,
        );
        $this->content = new OK_Collection();
        $this->objects = new OK_Objects();
        $this->fonts = new OK_Fonts();
        $this->images = new OK_Images();
        $this->scripts = new OK_Items('script');
        $this->styles = new OK_Items('style');
        $this->_dialogs = new OK_Dialogs();
    }

    /**
     *
     *
     */
    public function write($text)
    {
        $this->content->write($text);
    }

    // --

    /**
     *
     *
     */
    private function _disable_proxy_cache()
    {
        if (!$this->response->cache)
        {
            $this->debug("Sending no-cache headers.", 2);

            header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
            header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');
            header('Cache-Control: no-store, no-cache, must-revalidate');
            header('Cache-Control: post-check=0, pre-check=0', false);
            header('Pragma: no-cache');
        }
        elseif (is_int($this->response->cache))
        {
            $seconds_to_cache = $this->response->cache;

            $this->debug("Cache response for $seconds_to_cache seconds.", 2);

            $ts = gmdate("D, d M Y H:i:s", time() + $seconds_to_cache) . " GMT";
            header("Expires: $ts");
            header("Pragma: cache");
            header("Cache-Control: max-age=$seconds_to_cache");
        }
    }

    /**
     *
     *
     */
    protected function _execute(OK_Request $request)
    {
        // --

        $this->_stats['execute_start'] = $this->stamp();

        $saved_app = $this->app;
        $saved_status = $this->_status;
        //$this->_status = self::EXECUTING;
        $saved_request = $this->request;
        $this->request = $request;
        $this->_protected = ($request->command[0] === '.');

        // --

        $this->app = new OK_Runtime($request);
        $this->app->run();

        // --

        $this->_protected = false;
        $this->request = $saved_request;
        $this->_status = $saved_status;
        $this->app = $saved_app;

        // --

        $this->_stats['execute_end'] = $this->stamp();
    }

    /**
     *
     *
     */
    protected function _fetch(OK_Request $request, $xml = false)
    {
        $saved_response = $this->response;
        $saved_content = $this->content;

        $this->content = new OK_Collection();
        $this->response = new OK_Response();
        $this->_execute($request);
        $new_content = $this->content;

        if ($xml) {
            $new_content = $this->_get($new_content->toHTML());
        };

        $this->content = $saved_content;
        $this->response = $saved_response;

        return $new_content;
    }

    /**
     *
     *
     */
    protected function _lib_get_id($app_id, $name)
    {
        if ($app_id == '.')
            $id = ".shared.$src";
        elseif ($app_id[0] == '.')
            $id = ".system.".substr($app_id, 1).'.'.$src;
        else
            $id = ".program.$app_id.$src";
    }

    /**
     *
     *
     */
    protected function _reset()
    {
        if ($this->app)
            $this->app->destroy();

        if ($this->content)
            $this->content->destroy();

        unset($this->app);
        $this->content = new OK_Collection();
        $this->fonts = new OK_Fonts();
        $this->scripts = new OK_Items('script');
        $this->styles = new OK_Items('style');
        $this->images = new OK_Images();
        $this->response = new OK_Response();
        $this->client = new OK_Client();

        $this->_buffer = array();
        $this->_dialogs = new OK_Dialogs();
    }

    /**
     *
     * @access private
     */
    protected function _restore_error_handler()
    {
        if (!$this->errors)
            return;

        $params = array();
        foreach ($this->request->params as $param => $value) {
            if (is_object($value)) $value = "[object]";
            if (is_array($value)) $value = "[array]";
            $nvalue = preg_replace("/\n.*/", "", $value);
            if (strlen($nvalue) < strlen($value)) $nvalue .= "[cut]";
            $params[] = "$param='$nvalue'";
        }
        $params = join(', ', $params);
        $command = $this->request->command;
        if ($params) $command .= "($params)";

//      if (!$this->session->new && false) {
//          $dialog = $this->fetch(".ok/error", array('command' => $command));
//          $dialog->toHTML();
//      }
    }

    /**
     *
     *
     */
    protected function _restore_output_handler()
    {
        while ($this->_buffer_level < ob_get_level())
        {
            $ob = ob_get_clean();
            if ($ob) {
                $this->_buffer[] = $ob;
            }
        }

        if ($this->_buffer) {
//          $this->debug("Processing direct output...", 3);

            $direct_output = join('', $this->_buffer);
//          $this->_buffer = array();

            switch ($this->config->output->direct_output) {
                case 'append':
//                  $this->debug("Appending output...", 4);
                    $this->_output .= $direct_output;
                    break;
                case 'discard':
                case 'dispose':
//                  $this->debug("Disposing direct output...", 4);
                    break;
                case 'display':
//                  $this->debug("Displaying direct output...", 4);

                    $params = array();
                    foreach ($this->request->params as $param => $value) {
                        $nvalue = preg_replace("/\n.*/", "", $value);
                        if (strlen($nvalue) < strlen($value)) $nvalue .= "[cut]";
                        $params[] = "$param='$nvalue'";
                    }
                    $params = join(', ', $params);
                    $command = $this->request->command;
                    if ($params) $command .= "($params)";

                    //trigger_error(sprintf('Direct output while executing "%s".', escapeshellarg($command)), E_USER_NOTICE);
                    $this->debug("Direct output detected: " . $direct_output, 0, "OUTPUT", true);

                    if ($this->_status == self::INITIALIZED) {
                        $msg = "Direct server output detected while executing your request:";
                        $dialog = $this->fetch(".ok/output", array("message" => $msg, "output" => nl2br(htmlentities($direct_output))));
                        $dialog->toHTML();
                    }

                    break;

                case 'prepend':
//                  $this->debug("Prepending direct output...", 4);
                    $this->_output = $direct_output . $this->_output;
                    break;

                default:
//                  $this->debug("There was an error processing direct output.");
                    throw new Exception("There was an error processing direct output.");
            }
        } else {
//          $this->debug("There were no direct output to process.", 4);
        }
    }

    /**
     *
     * @access private
     */
    protected function _get($output = '')
    {
        if ($this->_status === self::INITIALIZING && !defined("OK_NO_INIT"))
        {
            $final = file_get_contents(OK_ROOT . "/ok.xml");
            $final = str_replace("OK_LANGUAGE", $this->response->language, $final);

            // --

            $item_id = "/ok/system/style";
            $fname = OK_ROOT . "/ok.css";
            if ($_output = $this->cache->get($item_id, $fname)) {
                $_output = array($_output);
            } else {
                $_output = array(preg_replace_callback(self::FILTER_STYLE, array($this, '____style'), file_get_contents($fname)));
                $_output[0] = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $_output[0]);
                $_output[0] = str_replace(array("\r\n", "\r", "\n", "\t", '  ', '    ', '    '), '', $_output[0]);
                $this->cache->cache($item_id, $_output[0]);
            }

            foreach ($this->styles->items as $index => $item)
            {
                $_item_id = $item['id'];
                $item_id = md5($_item_id);
                array_push($_output, $this->___style($item['app_id'], $item['name']));
                $this->session->instance->cache($_item_id);
                $this->client->call("ok", "cache.add", $item_id, "style", "");
                $this->client->call("ok", "cache.setExecuted", $item_id, true);
            }

            $style = '<style>' . implode($_output) . '</style>';

            // --

            $mtime = 0;
            $_output = array();
            $item_id = "/ok/system/script";
            for ($i = 0, $l = count($this->_model); $i < $l; $i++) {
                $fname = OK_ROOT . DIRECTORY_SEPARATOR . 'model' . DIRECTORY_SEPARATOR . $this->_model[$i] . ".obj.js";
                $_mtime = filemtime($fname);
                if ($_mtime > $mtime) {
                    $mtime = $_mtime;
                }
            }
            if ($this->config->mtime > $mtime) {
                $mtime = $this->config->mtime;
            }

            if ($_output = $this->cache->get($item_id, $mtime)) {
                $_output = array($_output);
            } else {
                if ($this->config->system->minify) {
                    require_once OK_ROOT . '/model/script.obj.php';
                }
                for ($i = 0, $l = count($this->_model); $i < $l; $i++) {
                    $fname = OK_ROOT . DIRECTORY_SEPARATOR . 'model' . DIRECTORY_SEPARATOR . $this->_model[$i] . ".obj.js";
                    $__output = preg_replace_callback(self::FILTER_SCRIPT, array($this, '____script'), file_get_contents($fname));
                    if ($this->config->system->minify) {
                        $__output = OK_Script::process($__output);
                    }
                    $_output[] =  $__output;
                }
                unset($__output);
                foreach ($this->config->colors->get() as $color => $value) {
                    array_push($_output, "ok.colors.$color = '$value';");
                }
                array_push($_output, "ok.request.uri = '" . $this->config->system->landing . "';");
                //~ array_push($_output, "ok.debug.console = " . ($this->config->system->log_client_console ? 1 : 0) . ";");

                $this->cache->cache($item_id, implode("", $_output));
            }

            // --

            $_output[] = "<!-- OK_JS_INIT -->";

            // --

            // Process scripts
            $items = $this->scripts->items;
            foreach ($items as $index => $item)
            {
                $_item_id = $item['id'];
                $item_id = md5($_item_id);
                $_output[] = $this->___script($item['app_id'], $item['name']);
                $this->session->instance->cache($_item_id);
                $this->client->call("ok", "cache.add", $item_id, "script", "");
                $this->client->call("ok", "cache.setExecuted", $item_id, true);
            }

            // --

            $script = '<script type="text/javascript">' . implode($_output) . '</script>';

            // --

            // Process images
            foreach ($this->images->items as $item_id => $item) {
                $_item_id = $item['id'];
                $item_id = md5($_item_id);
                $this->client->call("ok", "cache.add", $item_id, "image", $this->images->get_image_content($item['name'], $item['app_id']));
                $this->session->instance->cache($_item_id);
            }

            // --

            $dialogs_html = "";
            foreach ($this->_dialogs->items as $dialog)
            {
                $d = "<div id='" . $dialog['id'] . "' class='" . $dialog['class'] . "' style: position: absolute; left: " . $dialog['left'] . "px; top: " . $dialog['top'] . "px; width: " . $dialog['width'] . "px; height: " . $dialog['height'] . "px; display: none;'>";
                if ($dialog['html']) {
                    $d .= $dialog['html'];
                }
                $d .= "</div>";
                $dialogs_html .= $d;

                if ($dialog["show"]) {
                    $this->client->call($this->client->get($dialog["id"]), "show");
                }
            }

            $final = str_replace("<!-- OK_DIALOGS -->", $dialogs_html, $final);

            // --

            $this->client->call("ok", "__init");

            // --

            if ($this->response->onload) {
                $this->client->execute($this->response->onload);
            }

            $output .= '<script>' . $this->client->_get(true) . '</script>';

            // --

            $output = str_replace("<!-- OK_BODY -->", $output, $final);
            $output = str_replace("<!-- OK_HEAD -->", $style . $script, $output);

            // --

            $title = "";
            $meta = $this->response->meta;
            for ($i = 0, $l = count($meta); $i < $l; $i++) {
                $_meta = $meta[$i];
                if (isset($_meta['tag'])) {
                    $tag = "<{$_meta['tag']}";
                    if (isset($_meta['name'])) {
                        $tag .= " name=\"{$_meta['name']}\"";
                    }
                    if (isset($_meta['property'])) {
                        $tag .= " property=\"{$_meta['property']}\"";
                    }
                    if (isset($_meta['content'])) {
                        $tag .= " content=\"{$_meta['content']}\"";
                    }
                    if (isset($_meta['value'])) {
                        $tag .= ">{$_meta['value']}</{$_meta['tag']}>";
                    } else {
                        $tag .= "/>";
                    }
                    $title .= "$tag\n";
                }
            }

            $links = $this->response->links;
            for ($i = 0, $l = count($links); $i < $l; $i++) {
                $_link = $links[$i];
                $title .= "<link rel=\"{$_link['rel']}\" hreflang=\"{$_link['hreflang']}\" href=\"{$_link['href']}\"/>\n";
            }

            $output = str_replace("<!-- OK_TITLE -->", $title, $output);
            $output = str_replace("<!-- OK_NOSCRIPT -->", $this->response->noscript, $output);
        }
        else
        {
            $xml = sprintf("<okp version=\"%s\"><response type=\"%s\" target=\"%s\" method=\"%s\" onload=\"%s\">", $this->version, $this->response->type, $this->response->target, $this->response->method, $this->response->onload);

            foreach ($this->images->items as $index => $item) {
                $_item_id = $item['id'];
                $item_id = md5($_item_id);
                if (!$this->session->instance->is_cached($_item_id)) {
                    $this->client->call("ok", "cache.add", $item_id, "image", $this->images->get_image_content($item['name'], $item['app_id']));
                    $this->session->instance->cache($_item_id);
                }
            }

            foreach ($this->_dialogs->items as $dialog)
            {
                $xml .= '<dialog id="' . $dialog['id'] . '"';
                if ($dialog["show"]) {
                    $xml .= " show=\"yes\"";
                }
                if ($dialog['type']) {
                    $xml .= " type=\"" . $dialog['type'] . '"';
                }

                $xml .= ' dock="' . $dialog['dock'] . '"';
                $xml .= ' class="' . $dialog['class'] . '"';
                $xml .= ' width="' . $dialog['width'] . '"';
                $xml .= ' height="' . $dialog['height'] . '"';
                $xml .= ' left="' . $dialog['left'] . '"';
                $xml .= ' top="' . $dialog['top'] . '"';

                if ($dialog['center']) {
                    $xml .= ' center="' . $dialog['center'] . '"';
                }
                if ($dialog['close']) {
                    $xml .= ' close="' . $dialog['close'] . '"';
                }
                $xml .= ">";

                $script = "";
                if (isset($dialog['script'])) {
                    $script = $dialog['script'];
                };
                $xml .= '<script><![CDATA[' . $script . ']]></script>';
                $xml .= '<body><![CDATA[' . $dialog['html'] . ']]></body>';

                $xml .= "</dialog>";
            }

            foreach ($this->scripts->items as $index => $item) {
                $_item_id = $item['id'];
                $item_id = md5($_item_id);
                $item_app = $item['app_id'];
                $item_src = $item['name'];
                if ($this->session->instance->is_cached($_item_id))
                    $xml .= "<require type='script' id='$item_id' app_id='$item_app' src='$item_src'/>";
                else
                {
                    $item_output = $this->___script($item['app_id'], $item['name']);
                    $xml .= "<script id='$item_id' type='library'><![CDATA[$item_output]]></script>";
                    $this->session->instance->cache($_item_id);
                }
            }

            foreach ($this->styles->items as $index => $item) {
                $_item_id = $item['id'];
                $item_id = md5($_item_id);
                $item_app = $item['app_id'];
                $item_src = $item['name'];
                if ($this->session->instance->is_cached($_item_id)) {
                    $xml .= "<require type='style' id='$item_id' app_id='$item_app' src='$item_src'/>";
                } else {
                    $item_output = $this->___style($item['app_id'], $item['name']);
                    $xml .= "<style id='$item_id' type='library'><![CDATA[$item_output]]></style>";
                    $this->session->instance->cache($_item_id);
                }
            }

            if ($script_output = $script_output = $this->client->_get(true)) {
                $xml .= sprintf("<script><![CDATA[%s]]></script>", $script_output);
            }

            if ($output) {
                $xml .= "<body><![CDATA[" . $output . "]]></body>";
            }

            $output = $xml . "</response></okp>";
        }

        return $output;
    }

    /**
     *
     * @access private
     */
    protected function _send()
    {
        if ($this->_sent) {
            throw new Exception("Response already sent.");
        }

        $this->_stats['preparing_response'] = $this->stamp();

//      $this->debug("Preparing response...", 2);

        $output = $this->content->toHTML();
        $this->content = new OK_Collection();

        // --

        if ($this->response->type == "auto" && $this->_status === self::INITIALIZING) {
            $output = $this->_get($output);
            $this->response->type = "init";
        }

        // --

        $this->_restore_output_handler();
        $this->_restore_error_handler();
        restore_exception_handler();

        $this->_sent = true;
        switch ($this->response->type)
        {
            case 'init':
                header("Content-Type: text/html");
                header("X-Powered-By: OK.OS");
                header("Server: OK.OS");
                header("X-Content-Length: " . strlen($output));
                header("OKP: 1");
                $this->_disable_proxy_cache();

                $this->client->execute("ok.sid=\"" . $this->session->id . "\";");
                $this->client->set("ok", "wid", $this->session->instance->id);
                $this->client->set("ok", "client.ie", $this->client->ie);
                $this->client->set("ok", "client.webkit", $this->client->webkit);
                $this->client->set("ok", "client.safari", $this->client->safari);
                $this->client->set("ok", "client.opera", $this->client->opera);
                $this->client->set("ok", "client.moz", $this->client->moz);
                $this->client->set("ok", "client.platform", $this->client->platform);
                $this->client->set("ok", "client.version", $this->client->version);
                $this->client->set("ok", "client.name", $this->client->name);
                $this->client->set("ok", "client.mobile", $this->client->mobile);

                $output = str_replace("<!-- OK_JS_INIT -->", $this->client->_get(true), $output);

                echo $output;
                break;
            case 'plain':
                header("Content-Type: " . $this->response->content_type);
                header("X-Powered-By: OK.OS");
                header("Server: OK.OS");
                header("X-Content-Length: " . strlen($output));
                header("OKP: 1");
                $this->_disable_proxy_cache();

                // --

                echo $output;
//              $this->debug("Plain text response sent.", 2);
                break;

            default:
                $output = $this->_get($output);
                $this->_disable_proxy_cache();

                header("OKP: 1");
                header("Content-Type: text/xml");
                header("X-Powered-By: OK.OS");
                header("Server: OK.OS");
                header("X-Content-Length: " . strlen($output));

                echo $output;
//              $this->debug("Response sent.", 2);
                break;
        }

        $this->_status = self::FINISHED;
        $this->_stats['response_prepared'] = $this->stamp();

        // --

        $this->debug(sprintf("Response prepared in %01.4f, request sent in %01.4f second(s).",$this->_stats['response_prepared'] - $this->_stats['preparing_response'], $this->_stats['response_prepared'] - $this->_stats['started']), 0);

        // --

        if (isset($this->app) && is_object($this->app))
            $this->app->destroy();

        if ($this->content) {
            $this->content->destroy();
        }

        if ($this->objects) {
            $this->objects->destroy();
        }

        unset($this->app);
        unset($this->cache);
        unset($this->client);
        unset($this->config);
        unset($this->content);
        unset($this->_dialogs);
        unset($this->objects);
        unset($this->fonts);
        unset($this->images);
        unset($this->request);
        unset($this->response);
        unset($this->scripts);
        unset($this->status);
        unset($this->styles);
        unset($this->session);

        parent::$_shared = null;
    }

    // ---------------

    /**
     *
     *
     */
    public function __destruct()
    {
        $this->debug("Shutdown command received.", 2);

        define('OK_REQUEST_SHUTDOWN', 1);

        if (!$this->_sent && !defined('OK_FATAL_ERROR')) {
            $this->debug("Unexpected server shutdown detected.", 0);
//          trigger_error("Unexpected server shutdown detected.", E_USER_WARNING);

            $this->_send();
//          define('OK_FATAL_ERROR', 1);
//          if ($this->_ok)
//              $this->_ok->_destroy();
        }

        $this->_stats['finished'] = $this->stamp();

//      $this->debug(sprintf("Request processed in %01.4f (executed in %01.4f) second(s).",$this->_stats['finished'] - $this->_stats['started'], $this->_stats['response_prepared'] - $this->_stats['preparing_response']), 1);

        parent::__destruct();
    }

    /**
     *
     * @iaccess private
     * @todo context
     */
    public function __error($errno, $errstr, $errfile = null, $errline = null, $context = null)
    {
        error_reporting($this->config->error_handling->server_error_reporting);

        if (!(error_reporting() & $errno))
            return;

        $error_names = array(1 => 'E_ERROR', 2 => 'E_WARNING', 4 => 'E_PARSE', 8 => 'E_NOTICE', 16 => 'E_CORE_ERROR', 32 => 'E_CORE_WARNING',
            64 => 'E_COMPILE_ERROR', 128 => 'E_COMPILE_WARNING', 256 => 'E_USER_ERROR', 512 => 'E_USER_WARNING', 1024 => 'E_USER_NOTICE',
            2048 => 'E_STRICT', 4096 => 'E_RECOVERABLE_ERROR');

        $debugtrace = true;
        if ($errno & (E_WARNING | E_USER_WARNING)) {
            $module = 'WARNING';
        } elseif ($errno  & (E_NOTICE | E_USER_NOTICE)) {
            $module = 'NOTICE';
            $debugtrace = false;
        } else {
            $module = 'ERROR';
        }

        $errnostr = "0";
        if (isset($error_names[$errno]))
            $errnostr = $error_names[$errno];

        $now = @date('d-M-Y H:i:s');

        $module = str_pad($module, 10, ':', STR_PAD_BOTH);

        if (isset($errfile))
            $errstr .= " in $errfile";
        if (isset($errline))
            $errstr .= " on line $errline";

        $_trace = "";
        $trace = debug_backtrace(false);

        $error = array(
            'errno' => $errno,
            'errstr' => $errstr,
            'errfile' => $errfile,
            'errline' => $errline,
            'context' => $context,
            'trace' => $trace,
            'error_string' => "[$errnostr] $errstr"
        );

        $this->errors[] = $error;

        $this->debug("--------------", 0, $module, true);

        $this->debug("[$errnostr] $errstr", 0, $module, true);

        for ($i=0, $l = count($trace); $i < $l && $i < 1; $i++)
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
        //              $ts .= "\"" . str_replace("\n", '\\n', $trace[$i]['args'][$m]) . "\"";
                        $ts .= "<<string>>";
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

            if (isset($trace[$i]['class'])) {
                if ($trace[$i]['class'] == 'OK') {
                    if ($trace[$i]['function'] == '__construct') {
                        $ts = "OK Initialized.";
                    }
                } elseif ($trace[$i]['class'] == 'OK_Object' && $trace[$i]['function'] == 'toHTML') {
                    array_splice($trace, $i, 1);
                    $i--;
                    $l--;
                    continue;
                }
            }

            $_trace .= $ts . "\n";
            $this->debug("[BACKTRACE:$i] $ts", $debugtrace ? 0 : 1, $module, true);
        }

        // --

        if (in_array($errno, array(E_ERROR, E_USER_ERROR))) {
            $this->debug("System halted!", 0, "ERROR HANDLER", true);
            throw new OK_Exception("System halted [1]!");
        }

    }

    /**
     *
     *
     * @iaccess private
     */
    public function __exception($x)
    {
        define('OK_FATAL_ERROR', 1);

        $this->debug("--------------", 1, 'EXCEPTION', true);
        $this->debug("Exception: " . $x->getMessage(), 0, 'EXCEPTION', true);

        if ($x instanceOf Error) {
            $this->debug((string) $x);
        }

        $_trace = "";
        $trace = $x->getTrace();
        array_shift($trace);

        for ($i = 0, $l = count($trace); $i < $l && $i < 1; $i++)
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

            $_trace .= $ts . "\n";
            $this->debug("[BACKTRACE:$i] $ts", 0, 'EXCEPTION', true);
        }

        $cmd = $this->request ? $this->request->command : "null";

//      $this->_reset();

        $this->errors = array();
        $this->_restore_error_handler();

        $this->_sent = true;
        echo "Exception: " . $x->getMessage();




//      if (!$this->session->new) {
//          $this->execute('.ok/exception', array('x' => $x, 'command' => $cmd));
//      } else {
//          $this->response->type = "plain";
//          $this->write("Exception: " . $x->getMessage());
//      };
//      $this->_send();
    }

    /**
     *
     */
    public function ___script ($app_id, $src)
    {
        $ext = "js";
        if ($app_id == '.') {
            $id = "/ok/script/object/$src";
            $dirName = OK_ROOT . '/objects';
            $ext = "obj.js";
        } elseif ($app_id[0] == '.') {
            $id = "/ok/script/system/program/" . substr($app_id, 1) . "/service/". $src;
            $dirName = OK_ROOT . '/programs/' . substr($app_id, 1) . '/services';
        } else {
            $id = "/ok/script/program/$app_id/service/$src";
            $dirName = OK_PROGRAMS . '/' . $app_id . '/services';
        }

        $fileName = $dirName . '/' . preg_replace('/\.obj\.js$/i', '', $src) . '.' . $ext;

        if (!is_file($fileName)) {
            $this->debug("app_id: $app_id");
            $this->debug("fname: $fileName");
            throw new OK_Exception ("Error accessing javascript object.");
        }

        // --

        $output = $this->cache->get($id, filemtime($fileName));
        if (!$output)
        {
            $output = file_get_contents($fileName);

            if ($this->config->system->minify) {
                require_once OK_ROOT . '/model/script.obj.php';
                $output = OK_Script::process($output);
            }

            $this->cache->cache($id, $output);
        }

        $output = preg_replace_callback(self::FILTER_SCRIPT, function ($matches) use ($app_id) {
            return $GLOBALS['ok']->____script($matches, $app_id);
        }, $output);

        return $output;
    }

    /**
     *
     */
    public function ____script($matches, $app_id = ".")
    {
        $fname = $matches[1];
        $ext = pathinfo($fname, PATHINFO_EXTENSION);

        if ($ext == "gif" || $ext == "png") {
            return md5($this->images->load($fname, $app_id));
        }

        return $matches[1];
    }


    /**
     *
     */
    public function ___style ($app_id, $src)
    {
        if ($app_id == '.') {
            $id = "/ok/style/shared/$src";
            $dirName = OK_ROOT . '/objects';
        } elseif ($app_id[0] == '.') {
            $id = "/ok/style/system/program/".substr($app_id, 1)."/service/$src";
            $dirName = OK_ROOT . '/programs/' . substr($app_id, 1) . '/services';
        } else {
            $id = "/ok/style/program/$app_id/service/$src";
            $dirName = OK_PROGRAMS . '/' . $app_id . '/services';
        }

        $fileName = $dirName . '/' . preg_replace("/\.css$/", '', $src) . '.css';

        if (!is_file($fileName)) {
            $this->debug("app_id: $app_id");
            $this->debug("fname: $fileName");
            throw new OK_Exception ("Error accessing stylesheet object.");
        }

        // --

        $mtime = filemtime($fileName);

        if (false === ($output = $this->cache->get($id, $mtime)))
        {
            $output = preg_replace_callback(self::FILTER_STYLE, function ($matches) use ($app_id) {
                return $GLOBALS['ok']->____style($matches, $app_id);
            }, file_get_contents($fileName));

            $output = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $output);
            $output = str_replace(array("\r\n", "\r", "\n", "\t", '  ', '    ', '    '), '', $output);

            $this->cache->cache($id, $output);
        }

        return $output;
    }

    /**
     *
     */
    public function ____style ($matches, $app_id = '.')
    {
        $item_types = [
            'woff' => [
                'd' => 'fonts',
                't' => 'font/opentype'
            ],
            'png' => [
                'd' => 'media',
                't' => 'image/png'
            ]
        ];

        if (isset($matches[2]))
        {
            $item_id = $matches[2];
            $item_type = (preg_match("/^([a-z0-9_-]+)\.(woff)$/", $item_id, $_matches) ? "woff" : (preg_match("/^([a-z0-9_-]+)\.(png)$/", $item_id, $_matches) ? "png" : ""));

            if ($item_type)
            {
                $item_name = $_matches[1];
                $item_ext = $_matches[2];
                $item = $item_types[$item_type];

                if ($app_id == '.') {
                    $dirName = OK_ROOT;
                } elseif ($app_id[0] == '.') {
                    $dirName = OK_ROOT . '/programs/' . substr($app_id, 1);
                } else {
                    $dirName = OK_PROGRAMS . '/' . $app_id;
                }

                $fileName = $dirName . '/' . $item['d'] . '/' . $item_name . '.' . $item_ext;

                if (is_file($fileName)) {
                    return "url(data:" . $item['t'] . ";base64," . base64_encode(file_get_contents($fileName)) . ")";
                }
            }

        }
        else if (isset($matches[1]) && isset($this->config->colors->{$matches[1]}))
        {
            return $this->config->colors->{$matches[1]};
        }

        return $matches[0];
    }

    /**
     * Handles output issued from 'echo' or 'print' commands.
     *
     * @iaccess private
     */
    public function ___output($ob, $type)
    {
        // $this->debug("Processing output (type: $type)...", 0, "OUTPUT", true);
        if (!$ob)
        {
            // $this->debug("No output detected.", 0, "OUTPUT", true);
            return;
        }
        // ---------------

        // Detect php fatal and parser errors
        if (preg_match_all("/<ok><phperror>[\r\n]+(.+)[\r\n]+<\/phperror><\/ok>/Us", $ob, $matches, PREG_OFFSET_CAPTURE | PREG_SET_ORDER)) {
            $this->debug("PHP ERROR DETECTED!", 0, "PHP ERROR", true);
            foreach ($matches as $mid => $errmatch) {
                $errcode = 0;
                $errstr = $errmatch[1][0];
                $offset = $errmatch[0][1];
                $length = strlen($errmatch[0][0]) + $offset;
                $errfile = "n/a";
                $errline = 0;

                $ob = substr($ob, 0, $offset) . substr($ob, $length);

                if (preg_match("/^[ \t]*(Parse|Fatal|[a-zA_Z]+) error: (.*) in (.*) on line ([0-9]+)[ \t]*$/", $errstr, $matches2)) {
                    $errcode = $matches2[1] == 'Parse' ? E_PARSE : E_ERROR;
                    $errstr = $matches2[2];
                    $errfile = $matches2[3];
                    $errline = $matches2[4];
                }

                $this->debug("** ($errcode) $errstr in file $errfile on line $errline", 0, "PHP ERROR", true);
                // $this->__error($errcode, $errstr, $errfile, $errline);
            }

            $ob = trim($ob);

//          if ($ob) {
//              $debug = preg_replace("/\n.*/", "", $ob);
//              if (strlen($debug) < strlen($ob)) $debug .= "[cut]";
//              $this->debug("* Direct output detected: \"$debug\".", 2);
//          }

//          define('OK_FATAL_ERROR', 1);

        }

        // ---------------

        if (defined('OK_FATAL_ERROR')) {
//          $this->debug("* Processing fatal error output.", 3);
            if ($this->_buffer)
                $ob = join('', $this->_buffer) . $ob;
            return $ob;
        }

        // ---------------

        if (trim($ob)) {
            array_push($this->_buffer, $ob);
        };
    }
}
