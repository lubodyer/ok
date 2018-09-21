<?php
/**
 * OK Program Run-time.
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
 * OK Program Run-time.
 *
 * Provides access to the properties and the methods of OK Program Run-time.
 *
 * @package System
 */
final class OK_Runtime extends OK_Interface
{
    protected $app_id;
    protected $service_id;

    protected $root;
    protected $service;
    protected $strict = true;

    protected $_readonly = array('app_id', 'service_id', 'service', 'root', 'strict');
    protected $_request;
    protected $_xml;
    protected $_xpath;

    private static $_models = array();

    /**
     *
     *
     */
    public function __construct(OK_Request $request)
    {
        parent::__construct();

        // --

        $this->_request = $request;

        // --

        if (!$request->command) {
            throw new Exception("Invalid request.");
        }

        $command = explode("/", $request->command);
        if ("." === substr($command[0], 0, 1)) {
            $appdir = OK_ROOT . '/programs';
            $command[0] = substr($command[0], 1);
        } elseif ($command) {
            $appdir = OK_PROGRAMS;
        } elseif (!$command)
            throw new Exception("Access denied to execute \"$request->command\" [1].");

        $path = $appdir . '/' . array_shift($command);
        $this->root  = realpath($path);

        if (!$this->root) {
            throw new Exception("Access denied to execute \"$request->command\" [2].");
        }

        // ---------------

        $this->app_id = basename($this->root);
        if ("." === substr($request->command, 0, 1)) {
            $this->app_id = '.' . $this->app_id;
        }

        $this->service_id = join('/', $command);

        $d = new DOMImplementation();
        $this->_xml = $d->createDocument('', '', $d->createDocumentType('ok', '', OK_ROOT . DIRECTORY_SEPARATOR . 'ok.dtd'));

        // --

        $filename = $this->root . '/' . 'application.xml';
        if (!$this->_xml->load($filename)) {
            throw new Exception("There was an error loading application data.");
        }

        if ($this->_xml->documentElement->tagName != 'application')
            throw new Exception("\"$filename\" is not valid OK Application.");

        // --

        $this->_xpath = new DOMXPath($this->_xml);

        // --

        $this->debug("Application \"$this->root\" initialized.", 3);
    }

    /**
     *
     *
     */
    public function destroy()
    {
        unset($this->service);
        unset($this->_request);
        unset($this->_xml);
        unset($this->_xpath);
    }

    /**
     *
     *
     */
    public function run()
    {
        if (!$this->service_id) {
            $this->service_id = $this->_xpath->evaluate("string(/application/services/@default)");
        }

        $service = $this->get($this->service_id);
        $service_id = $this->service_id;

        if (!isset($service)) {
            throw new Exception("Unable to execute \"".$this->_request->command."\".");
        }

        // --

        $ok_saved_engine = null;
        if (isset(self::$_shared['_engine'])) {
            $ok_saved_engine = self::$_shared['_engine'];
        }
        self::$_shared['_engine'] = $this;

        // --

        if ($service->hasAttribute('target'))
            self::$_shared['_response']->target = $service->getAttribute('target');

        if ($service->hasAttribute('method'))
        {
            switch ($service->getAttribute('method'))
            {
                case "append":
                    self::$_shared['_response']->method = OK::LAYOUT_APPEND_CHILD;
                    break;
                case "insert":
                    self::$_shared['_response']->method = OK::LAYOUT_INSERT_AFTER;
                    break;
                default:
                    self::$_shared['_response']->method = OK::LAYOUT_REPLACE_CONTENT;
            }
        }

        if ($service->hasAttribute('type'))
            self::$_shared['_response']->type = $service->getAttribute('type');

        if ($service->hasAttribute('output'))
            self::$_shared['_config']->output->direct_output = $service->getAttribute('output');

        // --

        if (isset(self::$_models[$this->app_id])) {
            $model = self::$_models[$this->app_id];
        } elseif (is_file($this->root . DIRECTORY_SEPARATOR . 'application.obj.php')) {
            $model = get_declared_classes();
            require_once $this->root . DIRECTORY_SEPARATOR . 'application.obj.php';
            $model = array_diff(get_declared_classes(), $model);
            $models = count($model);
            $model = array_pop($model);
            if (!$models) {
                throw new OK_Exception("Error initializing program model - model not found.");
            } elseif ($models > 1) {
                throw new OK_Exception("Error initializing program model - there must be exactly one model.");
            } elseif (!is_subclass_of($model, 'OK_Program')) {
                throw new OK_Exception("Program model must extend OK_Program.");
            }
            self::$_models[$this->app_id] = $model;
        } else {
            $model = 'OK_Program';
        }

        // --

        $ok_old_include_path = get_include_path();
        set_include_path($this->root . DIRECTORY_SEPARATOR . "model");

        self::$_shared['_program'] = new $model();

        // --

        if ($service->hasAttribute('xml') && $service->getAttribute('xml')) {
            $this->ok->add($this->load($service_id));
        }

        if ($service->hasAttribute('php') && $service->getAttribute('php')) {
            $phpname = $this->root . '/services/' . $service_id . '.php';
            if (!is_file($phpname)) {
                throw new Exception("Service \"$service_id\" PHP controller does not exist.");
            }
            self::$_shared['_program']->__run($phpname);
        }

        if ($service->hasAttribute('css') && $service->getAttribute('css')) {
            $this->ok->styles->add($service_id);
        }

        if ($service->hasAttribute('js') && $service->getAttribute('js')) {
            $jsfile = $this->root . '/services/' . $service_id . '.js';
            if (!is_file($jsfile)) {
                throw new OK_Exception("Service JS controller not found.");
            }

            $this->ok->scripts->add($service_id);
        }


        // --

        set_include_path($ok_old_include_path);

        unset(self::$_shared['_program']);

        if ($ok_saved_engine) {
            self::$_shared['_engine'] = $ok_saved_engine;
        } else {
            unset(self::$_shared['_engine']);
        }
    }

    /**
     * Retrieves the service definition.
     * @param string $id The ID of the requested service.
     * @return object DOMNode
     * @access private
     */
    protected function get($id)
    {
        $service_path = explode("/", $id);
        $service_id = array_pop($service_path);
        $services_query = "/application/services";
        while (null !== ($services_group = array_shift($service_path))) {
            $services_query .= sprintf('/services[@id="%s"]', addslashes($services_group));
        }
        $service_query = sprintf("%s/service[@id='%s']", $services_query, addslashes($service_id));
        $query = $this->_xpath->query($service_query);
        if ($query) {
            if ($query->length == 1) {
                return $query->item(0);
            }

            $default_query = sprintf("string(%s/services[@id='%s']/@default)", $services_query, addslashes($service_id));
            $default_id = $this->_xpath->evaluate($default_query);
            if (!empty($default_id)) {
                $service_query = sprintf("%s/services[@id='%s']/service[@id='%s']", $services_query, addslashes($service_id), addslashes($default_id));
                $query = $this->_xpath->query($service_query);
                if ($query) {
                    if ($query->length == 1) {
                        $this->service_id .= '/' . $default_id;
                        return $query->item(0);
                    }
                }
            }
        }

        throw new OK_Exception("[404] Unable to locate service: {$this->app_id}/{$id}");
    }

    /**
     *
     */
    protected function load($service_id)
    {
        global $ok;

        // --

        $fname = $this->root . '/services/' . $service_id . '.xml';
        if (!is_file($fname)) {
            throw new OK_Exception("Service \"$service_id\" view does not exist.");
        }

        // --

        $cid = "/ok/xml/" . $this->app_id . '/' . $this->service_id;
        if ($cache = $ok->cache->get($cid, filemtime($fname)))
        {
            $cache = unserialize($cache);
            $objects = $cache['objects'];
            $scripts = $cache['scripts'];
            $styles = $cache['styles'];
            $images = $cache['images'];
            $script = $cache['script'];
            $output = $cache['output'];

            $ok->styles->_set($styles);
            $ok->scripts->_set($scripts);
            $ok->images->_set($images);

            foreach ($objects as $sObjectName)
            {
                $objectName = 'OK_Object_' . ucfirst($sObjectName);
                if (!class_exists($objectName))
                {
                    $filename = OK_PROGRAMS . '/' . $this->app_id . '/objects/' . $sObjectName . '.obj.php';
                    if (file_exists($filename)) {
                        require_once $filename;
                    } else {
                        $filename = OK_ROOT . '/objects/' . $sObjectName . '.obj.php';
                        if (!file_exists($filename)) {
                            trigger_error("Object \"$sObjectName\" does not exist!", E_USER_ERROR);
                        }
                        require_once $filename;
                    }
                }
            }

            ini_set('unserialize_callback_func', 'ok_unserialize_callback');
            $output = unserialize($output);

            if (strlen($script)) {
                $this->client->execute($script);
            }

            return $output;
        }

        // --

        $xml = new DOMDocument('1.0', 'utf-8');
        $xml->loadXML(self::$_shared['_program']->__load($fname));

        $errors = libxml_get_errors();
        if (count($errors)) {
            foreach ($errors as $error) {
                $error_type = E_USER_ERROR;
                switch ($error->level) {
                    case LIBXML_ERR_WARNING:
                        $error_type = E_USER_WARNING;
                    default:
                        trigger_error("XML PARSER: " . preg_replace("/\n/", "", $error->message) . " in " . $error->file . ' on line ' . $error->line . ", col " . $error->column . "." , $error_type);
                }
            }
        }
        libxml_clear_errors();

        // Validate OK XML root tag
        if ($xml->documentElement->tagName != "ok") {
            trigger_error("Error parsing service \"$service_id\". Interface files must start with \"ok\" tag.", E_USER_ERROR);
        }

        // Locate interface section
        $nodelist = $xml->documentElement->getElementsByTagName("interface");
        $interface = $nodelist->item(0);
        if (!$interface) {
            trigger_error("Error parsing service \"$service_id\". Missing interface section.", E_USER_ERROR);
        }

        // Process response onload
        if ($interface->hasAttribute('onload'))
            $this->ok->response->onload = $interface->getAttribute('onload');

        $output = new OK_Collection;
        for ($i=0; $i<$interface->childNodes->length; $i++) {
            $this->_load($interface->childNodes->item($i), $output);
        }

        // --

        return $output;
    }

    /**
     *
     */
    protected function _load($node, $collection)
    {
        switch ($node->nodeType)
        {
            case XML_ELEMENT_NODE:
                $params = array();
                for ($i = 0; $i < $node->attributes->length; $i++) {
                    $attribute = $node->attributes->item($i)->name;
                    $value = $node->attributes->item($i)->value;
                    $value = preg_replace_callback(OK::FILTER_STYLE, array($GLOBALS['ok'], '____style'), $value);
                    $params[$attribute] = $value;
                }

                $object = $this->ok->create($node->tagName, $params);

                for ($i=0; $i<$node->childNodes->length; $i++) {
                    $this->_load($node->childNodes->item($i), $object);
                }

                $collection->add($object);
                break;

            case XML_CDATA_SECTION_NODE:
            case XML_TEXT_NODE:
                $value = preg_replace("/^[ \t\r\n]+/", ' ', $node->nodeValue);
                $value = preg_replace("/[ \t\r\n]+$/", ' ', $value);
                if ($value !== ' ' && (!empty($value) || $value === "0")) {
                    $collection->write($value);
                }
                break;

            case XML_ENTITY_REF_NODE:
                $value = $node->textContent;
                $value = preg_replace("/^[ \t\r\n]+/", ' ', $value);
                $value = preg_replace("/[ \t\r\n]+$/", ' ', $value);
                if ($value !== ' ' && (!empty($value) || $value === "0")) {
                    $collection->write($value);
                }
                break;
        }
    }

    public function getServiceId() {
        return $this->service_id;
    }

    public function getAppId() {
        return $this->app_id;
    }

    public function __invoke($public, $system, $context)
    {
        if ($system[0] === '/') {
            return $system;
        }

        return NULL;
    }
}

// --

function ok_unserialize_callback($classname)
{
    $GLOBALS['ok']->debug("unserializecallback: $classname");
}

