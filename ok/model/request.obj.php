<?php
/**
 * OK Request - OK System Object.
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
 * OK Request - OK System Object.
 *
 * @package System
 */
final class OK_Request extends OK_Interface
{
    /**
     *
     *
     */
    public $id = OK_REQUEST_ID;

    /**
     * Sets or retrieves OK Command.
     * @var string
     */
    public $command;

    /**
     * Provides access to an associative array of user-defined request parameters.
     * @var array
     */
    public $params = array();

    /**
     *
     *
     */
    public $sid;

    /**
     *
     *
     */
    public $wid;

    /**
     *
     *
     */
    public function __construct($command, array $params = array())
    {
        if (!is_string($command))
            throw new Exception("Invalid request.");

        parent::__construct();

        $this->command = $command;
        $this->params = $params;
    }

    /**
     * Retrieves request parameter by its name.
     * @param string $sParamName The name of the request parameter.
     */
    public function get($sParamName)
    {
        if (isset($this->params[$sParamName]))
            return $this->params[$sParamName];
        return null;
    }

    /**
     *
     *
     */
    public function set($sParamName, $sParamValue)
    {
        $this->params[$sParamName] = $sParamValue;
    }

    /**
     *
     */
    public function encode()
    {
        return str_replace("+", "-", str_replace("/", ";", base64_encode(json_encode(array("command" => $this->command, "params" => $this->params, "sid"=>'', "wid"=>'')))));
    }

    /**
     *
     */
    public static function decode($encoded)
    {
        $encoded = str_replace("-", "+", str_replace(";", "/", $encoded));
//      $this->debug("e1:$encoded");
        $encoded = base64_decode($encoded);
//      $this->debug("e2:$encoded");
        $encoded = json_decode($encoded, true);
//      $this->debug("e3:$encoded");

        if ($encoded && isset($encoded['command']))
        {
            $params = array();
            if (isset($encoded['params']) && is_array($encoded['params'])) {
                $params = $encoded['params'];
            }
            $request = new OK_Request($encoded['command'], $params);
            if (isset($encoded['sid']) && isset($encoded['wid']) && is_string($encoded['sid']) && is_string($encoded['wid'])) {
                $request->sid = $encoded['sid'];
                $request->wid = $encoded['wid'];
                return $request;
            }
        }

//      $this->debug($encoded);
        throw new OK_Security_Exception("Access denied - invalid request. Webmaster is notified.");
    }

    /**
     *
     */
    public function toMD5()
    {
        $s = $this->command;
        foreach ($this->params as $param => $value) {
            $s .= $param;
            if (is_array($value)) {
                for ($i = 0, $l = count($value); $i < $l; $i++) {
                    $s .= $value[$i];
                }
            } else {
                $s .= $value;
            }
        }
        return md5($s);
    }

    /**
     *
     */
    public function __toString()
    {
        $command = $this->command;

        if ($this->ok && $this->ok->_protected) {
            $params = array();
            foreach ($this->params as $param => $value) {
                $nvalue = preg_replace("/\n.*/", "", $value);
                if (strlen($nvalue) < strlen($value)) $nvalue .= "[cut]";
                $params[] = "$param='$nvalue'";
            }
            $params = join(', ', $params);
            if ($params) $command .= "($params)";
        }

        return $command;

    }

}

