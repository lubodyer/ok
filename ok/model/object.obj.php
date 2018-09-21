<?php
/**
 * Abstract OK Object class.
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
 * Object - OK Object
 *
 * Base class for most of the Objects.
 *
 * @package System
 */
abstract class OK_Object extends OK_Interface implements Serializable
{
    /**
     * Sets or retrieves the string identifying the object.
     * @var string
     */
    protected $id;

    /**
     * Retrieves the string identifying the type of the Object.
     * @var string
     */
    protected $_type = 'object';

    /**
     * Retrieves a reference to the children objects collection.
     * @var OK_Collection
     */
    protected $content = null;

    /**
     * Retrieves a reference to the parent object, if any.
     * @var object
     */
    public $parent;

    /**#@+
     * @access private
     */

    /**
     * Objects can use this protected property to limit access to their content collection to specific
     * objects. Set the value of this parameter to NULL to completely disable access.
     * @see $_reject
     * @var array
     * @todo
     */
    protected $_accept = array();

    /**
     * Objects can use this protected property to describe event handling.
     * @var array
     * @todo
     */
    protected $_events = array();

    /**
     * Objects can use this property to set their collection to a custom object.
     * @var string
     */
    protected $_content;

    /**
     *
     */
    private $_event_data = array();

    /**
     * Objects can use this property to specify to which objects they can be added.
     * @var array
     * @todo
     */
    protected $_childof = array();

    /**
     * Objects can use this property to protect their default class name.
     * @var string
     */
    protected $_class;

    /**
     * Objects can use this property to limit the number of their children.
     *
     * Setting this property to zero disables its effect.
     *
     * @var int
     * @todo
     */
    protected $_maxchildren = 0;

    /**
     * Objects can use this property to require certain number of children.
     *
     * Setting this property to zero disables its effect.
     *
     * @var int
     * @todo
     */
    protected $_minchildren = 0;

    /**
     *
     */
    protected $_objects = array();

    /**
     *
     */
    protected $_params = array('id');

    /**
     *
     */
    protected $_processed = false;

    /**
     * An array specifying object's readonly parameters as allowed by master {@link OK_Interface} object.
     *
     * Note: If a object wants to use this functionality it must redeclare the default values!
     *
     * @see OK_Interface
     * @var array
     */
    protected $_readonly = array('_type', '_params', '_events', '_accept', '_reject');

    /**
     * Retrieves whether the object is registered with the {@link OK_Objects objects collection}.
     * @see OK::$objects
     * @var boolean
     */
    protected $_registered = false;

    /**
     * Objects can use this protected property to specify objects that must be present in their content
     * collection before they can successfully generate output.
     * @var array
     */
    protected $_require = array();

    /**
     * Objects can use this protected property to decline access to specific objects to its content collection.
     * @see $_accept
     * @var array
     */
    protected $_reject = array();

    /**
     * Objects can use this protected property to specify script libraries to be loaded at runtime.
     * @var array
     */
    protected $_scripts = array();

    /**
     * Objects can use this protected property to specify stylesheet files to be loaded at runtime.
     * @var array
     */
    protected $_styles = array();

    /**
     *
     */
    protected $_events_ = array();

    /**
     * Constructs the object.
     * @param array $aParams Optional array of object parameters
     * @param array $aObjects Optional array of objects to be added to content collection
     */
    final public function __construct($aParams = array(), $aObjects = array(), $bRegister = false)
    {
        $c = get_class($this);
        do {
            $c = get_parent_class($c);
            $v = get_class_vars($c);
            $ro = $v['_readonly'];
            if ($ro !== $this->_readonly)
            {
                $this->_readonly = array_merge($this->_readonly, array_diff($ro, $this->_readonly));
            }
            $p = $v['_params'];
            if ($p !== $this->_params)
            {
                $this->_params = array_merge($this->_params, array_diff($p, $this->_params));
            }
        } while ($c != __CLASS__);

        // --

        for ($i = 0, $l = count($this->_events); $i < $l; $i++) {
            $this->_events_[$this->_events[$i]] = 1;
        }

        // --

        parent::__construct();

        // --

        if (isset($aParams['id']) && !empty($aParams['id'])) {
            $this->id = $aParams['id'];
            unset($aParams['id']);
        } else
            $this->id = $this->uniqid($this->_type);

        // --

        $this->fire('beforeload', $aParams);

        // --

        if (is_null($this->content)) {
            if (isset($aParams['content']) && ($aParams['content'] instanceof OK_Object || $aParams['content'] instanceof OK_Collection)) {
                $this->content = $aParams['content'];
                unset($aParams['content']);
            } elseif ($this->_content) {
                $this->content = $this->create($this->_content);
            } else {
                $this->content = new OK_Collection($this);
            }
        }

        foreach ($this->_objects as $oname => $oclass) {
            $this->$oname = new $oclass();
        }

        // --

        if (isset($aParams) && is_array($aParams)) {
            foreach($aParams as $param => $value) {
                $this->__set($param, $value);
            }
        }

        // --

        if ($bRegister) {
            $this->_registered = $this->ok->objects->add($this);
        }

        // --

        $this->fire('load');

        // --

        if ($aObjects && is_array($aObjects)) {
            array_walk($aObjects, array($this, 'add'));
        } elseif ($aObjects) {
            $this->add($aObjects);
        }
    }

    /**#@-*/

    /**
     * Adds an object to object's content collection.
     * @param object $object The object to add
     */
    public function add($object)
    {
        $this->content->add($object);
    }

    /**
     * Creates and returns a new OK Object.
     *
     * Objects MUST use this method (and not {@link OK::create}) to create new objects.
     *
     * @access private
     * @param string $sObjectName The name of the object
     * @param array $aParams Optional associative array specifying object parameters
     * @param array $aObjects Optional array of child objects to be added to object's {@link $content}
     * @param boolean $bRegister (optional) Whether or not to automatically add the new object to {@link OK_Response}
     * @param boolean $bPrivate (optional)
     * @return object OK Object.
     */
    final protected function create($sObjectName, $aParams = array(), $aObjects = array(), $bRegister = false, $bPrivate = false)
    {
        if ($bPrivate && isset(self::$_shared['_engine'])) {
            $saved_app = self::$_shared['_engine'];
            unset(self::$_shared['_engine']);
        }

        $c = $this->ok->create($sObjectName, $aParams, $aObjects, $bRegister);
        $c->parent = $this;

        if (isset($saved_app))
            self::$_shared['_engine'] = $saved_app;

        return $c;
    }

    /**
     *
     *
     */
    final protected function create_request($command, $params = array())
    {
        return $this->ok->create_request($command, $params);
    }

    /**
     *
     *
     */
/*
    final protected function debug ($message, $level = 0, $module = null)
    {
        $trace = debug_backtrace();
        $object = $trace[1]['object'];

        if ($object == $this || $object == parent)
            parent::debug($message, $level, $module);
        else
            throw new Exception("Reserved function. This functionality will be supported in future versions.");
    }
*/

    /**
     * Destroys the object. Object cannot be used after a call to this method.
     * @return void
     */
    public function destroy()
    {
        parent::debug("Destroying [type $this->_type] [id $this->id].", 8);

        if ($this->_registered) {
            $this->ok->objects->remove($this->id);
            $this->_registered = false;
        }

        $this->fire('unload');

        $this->parent = null;

        if ($this->content instanceof OK_Collection) {
            $this->content->parent = null;
            $this->content->destroy();
        }
    }

    /**
     * Finds out whether an object is a valid object.
     *
     * @param mixed $object
     * @return boolean
     */
    final protected function is_object($object)
    {
        if (is_object($object) && $object instanceof OK_Object)
            return true;

        return false;
    }

    /**
     *
     *
     */
    final protected function load($sFileName, $bParsePHP = NULL)
    {
        $sFileName = OK_ROOT . '/objects/' . preg_replace("/\.xml$/", '', $sFileName) . '.xml';
        if (!file_exists($sFileName))
            throw new Exception(sprintf("Object interface file \"%s\" does not exist.", $sFileName));

        require_once(OK_ROOT.'/model/'.'xml.obj.php');
        $parser = new OK_Parser();
        return $parser->load($sFileName, false, $bParsePHP);
    }

    /**
     *
     *
     */
    final protected function loadXML($sXML)
    {
        require_once(OK_ROOT.'/model/'.'xml.obj.php');
        $parser = new OK_Parser();
        return $parser->loadXML($sXML, false);
    }

    /**
     *
     *
     */
    final protected function preload_image($src) {
        return $this->ok->images->load($src, $this->app_id ? $this->app_id : ".");
    }

    /**
     *
     *
     */
    protected function process_events($sObjectRef)
    {
        if ($this->_event_data)
            if ($this->client->is_ref($sObjectRef))
            {
                foreach ($this->_event_data as $eventName => $eventValue) {
                    $this->client->execute("$sObjectRef.$eventName=function(e){".$eventValue."};");
                    $this->debug("[e] Registering \"$eventName\" event handler for \"$this->id\".", 5);
                }

                if (isset($this->_event_data['onload']))
                    $this->client->fire($sObjectRef, 'load');

            } else
                trigger_error("($this->id) Invalid object reference while processing events on server.", E_USER_WARNING);
    }

    /**
     *
     */
    public function serialize()
    {
        $data = array('id' => $this->id);
        for ($i = 0, $l = count($this->_params); $i < $l; $i++) {
            $name = $this->_params[$i];
            $value = $this->__get($name);
            if ($value instanceof OK_Object) {
                $this->content->add($value);
            } elseif (!is_null($value)) {
                $data[$name] = $value;
            }
        }

        for ($i = 0, $l = count($this->_events); $i < $l; $i++) {
            $value = $this->__get($this->_events[$i]);
            if (!is_null($value)) {
                $data[$this->_events[$i]] = $value;
            }
        }

        $data['content'] = $this->content;
        $data['_registered'] = $this->_registered;
        return serialize($data);
    }

    /**
     *
     */
    public function unserialize($serialized)
    {
        $data = unserialize($serialized);
        $this->content = $data['content'];
        $register = $data['_registered'];
        unset($data['content']);
        unset($data['_registered']);

        $this->__construct($data, array(), $register);

        //$this->content->setParent($this);
/**
        $content = unserialize($content);
        $this->setContent($content);
*/
        if ($this->content instanceof OK_Collection) {
            $this->content->setParent($this);
        }
    }

    public function fixParent($parent)
    {
        $this->parent = $parent;
        $this->content->fixParent($this);
    }

    /**
     * Sets the content of the object to a specified content {@link OK_Collection}.
     * @param OK_Collection|OK_Object The Collection.
     */
    public function setContent($content)
    {
        if ($content instanceof OK_Collection) {
            if ($this->content instanceof OK_Collection) {
                $this->content = $content;
                $this->content->parent = $this;
                return true;
            } elseif ($this->content instanceof OK_Object) {
                return $this->content->setContent($content);
            }
        } elseif (is_array($this->content) && is_array($content)) {
            $this->content = $content;
            return true;
        }

        trigger_error("Failed to set content on <$this->_type>.", E_USER_WARNING);
    }

    /**
     * Sets the value of a specified property.
     * @param string name The name of the property.
     * @param mixed value The value of the specified property.
     */
    public function setProperty($name, $value)
    {
        if (strpos($name, '.') !== false) {
            $param = preg_replace("/^[^\.]+\./", '', $name);
            $name = preg_replace("/\..*$/", '', $name);
            if (is_array($this->$name) && isset($this->_params_[$name])) {
                $c = $this->$name;
                $c[$param] = $value;
                $this->$name = $c;
            }
        } else
            $this->__set($name, $value);
    }

    /**
     * Renders the Object to HTML format.
     * @return string HTML representation of the object.
     */
    final public function toHTML()
    {
        if ($this->_processed) {
            if ($this instanceof OK_Object_Dialog) {
                $dialog_mode = true;
            } else {
                throw new Exception(sprintf("Error: Attempt to process processed object \"%s\".", $this->id));
            }
        }

        // --

        $this->_processed = true;

        if (isset($this->expand) && $this->expand) {
            if (isset($this->width) && empty($this->width)) $this->width = '100%';
            if (isset($this->height) && empty($this->height)) $this->height = '100%';
            if (isset($this->pack)) $this->pack = false;
        } elseif (isset($this->pack) && $this->pack) {
            if (isset($this->width) && $this->width === '100%') $this->width = '';
            if (isset($this->height) && $this->height === '100%') $this->height = '';
            if (isset($this->expand)) $this->expand = false;
        }

        if (isset($dialog_mode))
        {
            $output = $this->__toHTML();
            $this->destroy();
        }
        else
        {
            $output = $this->_toHTML();
            if (!$this instanceof OK_Object_Dialog) {
                $this->destroy();
            }
        }

        // --

        for ($i=0, $l=count($this->_scripts); $i<$l; $i++) {
            $this->ok->scripts->add($this->_scripts[$i]);
        }

        for ($i=0, $l=count($this->_styles); $i<$l; $i++) {
            $this->ok->styles->add($this->_styles[$i]);
        }

        // --

        return $output;
    }

    /**
     *
     *
     */
    final private function fire($eventName)
    {
        if (!preg_match('/^[a-z]+$/', $eventName))
            throw new Exception("Unable to triger event for \"" . $this->get_name($this) . "\" - invalid event name: \"$eventName\".", -5);
//      $this->debug("Attempt to trigger \"$eventName\" event for \"" . $this->get_name($this) . "\".", 7, 'events');
        $method = 'on' . $eventName;
        if (method_exists($this, $method)) {
            $args = func_num_args() > 1 ? array_slice(func_get_args(), 1) : null;
            return $this->$method($args);
        }

        return null;
    }

    /**
     * Adds a free-style text to the object's content collection.
     *
     * Note: Use this function with care. Very likely it will be deprecated in the future versions.
     *
     * @param string $text Text to add
     */
    public function write($text)
    {
        $this->content->write($text);
    }

    // ---------------

    /**#@+ @access private */

    /** */
    final public function __destruct()
    {
        parent::__destruct();
    }

    /**
     *
     *
     * Note: Objects willing to extend this functionality must call this method for the properties they can't handle.
     */
    final public function __get($name)
    {
        if ($name === 'id')
            return $this->id;

        if ($name === 'content')
            return $this->content;

        if (isset($this->_objects[$name]))
            return $this->$name;

        if(isset($this->_params_[$name])) {
            $ret = $this->fire('get', $name);
            if (!is_null($ret))
                return $ret;
            else
                return parent::__get($name);
        }

        if (isset($this->_events_[$name])) {
            if (isset($this->_event_data[$name]))
                return $this->_event_data[$name];
            else
                return '';
        }

        return parent::__get($name);
    }

    /**
     *
     */
    final public function __isset($name)
    {
        if ($name === 'id' || $name === 'content' || isset($this->_objects[$name]))
            return true;
        else
            return parent::__isset($name);
    }

    /**
     * Magic functionality. Objects willing to extend this functionality must call this method for
     * properties they can't handle.
     */
    final public function __set($name, $value)
    {
        $name = strtolower($name);
        $param = null;

        if (strpos($name, '.') !== false) {
            $param = preg_replace("/^[^\.]+\./", '', $name);
            $name = preg_replace("/\..*$/", '', $name);
        }

        if ($name === 'id' && $value) {
            if ($this->_registered)
                $this->ok->objects->update($this->id, $value);
            $this->id = $value;
            $this->fire('set', $name, $value);
            return true;
        } elseif ($param && is_array($this->$name)) {
            $c = $this->$name;
            $c[$param] = $value;
            $this->$name = $c;

//          $this->$name[$param] = $value;
            return;
        } elseif (isset($this->_objects[$name])) {
            $this->$name = new $this->_objects[$name]($value);
        } elseif (isset($this->_params_[$name])) {
            if ($this->fire('set', $name, $value)) {
                return;
            }

            if ($name === 'expand' && isset($this->expand)) {
                $this->expand = OK_Validate::is_true($value);

                if ($this->expand) {
                    if (isset($this->width)) $this->width = '100%';
                    if (isset($this->height)) $this->height = '100%';
                    if (isset($this->pack)) $this->pack = false;
                }
            } elseif ($name === 'pack' && isset($this->pack)) {
                $this->pack = OK_Validate::is_true($value);
                if ($this->pack) {
                    if (isset($this->width)) $this->width = '';
                    if (isset($this->height)) $this->height = '';
                    if (isset($this->expand)) $this->expand = false;
                }
            } elseif ($name === 'class' && empty($value) && $this->_class)
                $this->class = $this->_class;
            else {
                parent::__set($name, $value);

                if (empty($value) && isset($this->expand) && $this->expand && ($name === "width" || $name === "height")) {
                    $this->expand = false;
            }
        }

        } elseif (isset($this->_events_[$name])) {
            $this->_event_data[$name] = (string) $value;
            return true;
        } else
            parent::__set($name, $value);
    }

    /*
     *
     */
    public function __toString()
    {
        return $this->_type;
    }

    /**#@-*/
}
