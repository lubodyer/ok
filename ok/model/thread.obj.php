<?php
/**
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
 *
 */
class OK_Thread extends OK_Interface
{
    /**
     *
     */
    protected $busy = false;

    /**
     *
     */
    protected $errors = array();

    /**
     *
     */
    protected $output = array();

    /**
     *
     */
    protected $status = array();

    /**
     *
     */
    protected $value = null;

    // --

    /**
     *
     */
    protected $_readonly = array('busy', 'errors', 'output', 'status', 'value');

    /**
     *
     */
    protected $_resource = null;

    // --

    /**
     *
     */
    public function __construct ($command, array $arguments = array(), $cwd = null, $env = null)
    {
        parent::__construct();

        if ($this->busy) {
            throw new OK_Exception("Unable to execute shell command.");
        }

        $this->output = array();
        $this->errors = array();

        $arguments = implode(" ", $arguments);

        $this->_resource = proc_open(
            escapeshellcmd($command) . " " . $arguments,
            array(
                0 => array("pipe", "r"),
                1 => array("pipe", "w"),
                2 => array("pipe", "w")
            ),
            $pipes,
            $cwd,
            $env
        );

        if (!is_resource($this->_resource)) {
            $this->debug("OK Process: $command $arguments", 0);
            throw new OK_Exception("Error executing thread.");
        }

        fclose($pipes[0]);

        $output = null;
        $errors = null;
        while (null != ($output = fgets($pipes[1])) || null != ($errors = fgets($pipes[2])))
        {
            if ($output) {
                $this->output[] = preg_replace("/[\r\n]/", "", $output);
            } elseif ($errors) {
                $this->errors[] = preg_replace("/[\r\n]/", "", $errors);
            }
        }

        fclose($pipes[1]);
        fclose($pipes[2]);

        $this->status = proc_get_status($this->_resource);
        $this->value =  $this->status['exitcode'];
        proc_close($this->_resource);
    }

    /**
     *
     */
    public function hasErrors()
    {
        return count($this->errors) > 0;
    }
}
