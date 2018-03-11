<?php
/**
 * This file contains the Script OK System Object.
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
 * Script - OK System Object
 *
 * @package System
 */
class OK_Script extends OK_Interface
{
    /**
     *
     * @var string
     */
    protected $buffer;

    /**
     *
     * @var int
     */
    protected $index = 0;

    /**
     *
     * @var string
     */
    protected $c1 = '';

    /**
     *
     * @var string
     */
    protected $c2 = '';

    /**
     *
     * @var string
     */
    protected $c3;

    /**
     *
     * @var string
     */
    protected $output = "";

    protected $_readonly = ['c3'];

    /**
     *
     * @param string $js
     * @throws Exception
     * @return bool|string
     */
    public static function process($js)
    {
        try
        {
            $p = [];
            $m = [];
            preg_match('/([+-])(\s+)([+-])/', $js, $m);

            if (!empty($m))
            {
                $pid = '--!' . crc32(time()) . '!--';
                $p[$pid] = $m[2];
                $js = preg_replace('/([+-])\s+([+-])/', "$1{$pid}$2", $js);
            }

            // --

            $self = new OK_Script();
            $js = $self->_process($js);

            // --

            if (count($p)) {
                foreach ($p as $pid => $_js) {
                    $js = str_replace($pid, $_js, $js);
                }
            }

            // --

            return $js;
        }
        catch (Exception $x)
        {
            if (isset($self)) {
                $self->clear();
                unset($self);
            }

            throw $x;
        }
    }

    /**
     *
     * @param string $js The raw script
     */
    protected function _process($js)
    {
        $this->buffer = str_replace('/**/', '', str_replace("\r", "\n", str_replace("\r\n", "\n", $js))) . "\n";
        $this->c1 = "\n";
        $this->c2 = $this->get();

        // --

        while ($this->c1 !== false && !is_null($this->c1) && $this->c1 !== '')
        {
            switch ($this->c1)
            {
                case "\n":
                    if (strpos('(-+{[@', $this->c2) !== false) {
                        $this->output .= $this->c1;
                        $this->_string();
                        break;
                    }

                    if ($this->c2 === ' ') {
                        break;
                    }

                case ' ':
                    if ($this->_alpha($this->c2)) {
                        $this->output .= $this->c1;
                    }
                    $this->_string();
                    break;

                default:
                    switch ($this->c2) {
                        case "\n":
                            if (strpos('}])+-"\'', $this->c1) !== false) {
                                $this->output .= $this->c1;
                                $this->_string();
                                break;
                            } else {
                                if ($this->_alpha($this->c1)) {
                                    $this->output .= $this->c1;
                                    $this->_string();
                                }
                            }
                            break;

                        case ' ':
                            if(!static::_alpha($this->c1))
                                break;

                        default:
                            if ($this->c1 == '/' && ($this->c2 == '\'' || $this->c2 == '"')) {
                                $this->_regexp();
                                continue;
                            }
                            $this->output .= $this->c1;
                            $this->_string();
                            break;
                    }
            }

            $this->c2 = $this->get();

            if (($this->c2 == '/' && strpos('(,=:[!&|?', $this->c1) !== false)) {
                $this->_regexp();
            }
        }

        // --

        $js = ltrim($this->output);
        return $js;
    }

    /**
     *
     */
    protected function clear()
    {
        unset($this->buffer);
        $this->output = '';
        $this->index = 0;
        $this->c1 = '';
        $this->c2 = '';
        unset($this->c3);
    }

    /**
     *
     */
    protected function get()
    {
        $index = $this->index;
        $c = $this->_get();

        // Check to see if we're potentially in c1 comment
        if ($c !== '/') {
            return $c;
        }

        $this->c3 = $this->_get();

        if ($this->c3 == '/') {
            return $this->comment1($index);

        } elseif ($this->c3 == '*') {
            return $this->_comment2($index);
        }

        return $c;
    }

    /**
     *
     */
    protected function _get()
    {
        if (isset($this->c3)) {
            $c = $this->c3;
            unset($this->c3);
        } else {
            $c = substr($this->buffer, $this->index, 1);
            if (isset($c) && $c === false) {
                return false;
            }
            $this->index++;
        }

        if ($c !== "\n" && ord($c) < 32) {
            return ' ';
        }

        return $c;
    }

    /**
     * Process single line comments
     *
     * @param int $index
     * @return string
     */
    protected function comment1($index)
    {
        $s = substr($this->buffer, $this->index, 1);
        $this->find("\n");

        if ($s == '@') {
            $end = ($this->index) - $index;
            unset($this->c3);
            $c = "\n" . substr($this->buffer, $index, $end);
        } else {
            $this->_get();
            $c = $this->_get();
        }

        return $c;
    }

    /**
     * Process multiline comments
     *
     * @param  int $index
     * @return bool|string False if there's no character
     * @throws Exception Unclosed comment
     */
    protected function _comment2($index)
    {
        $this->_get();
        $s = $this->_get();

        if ($this->find('*/'))
        {
            $this->_get();
            $this->_get();
            $c = $this->_get();

            if ($s == '!' || $s == '@')
            {
                if ($index > 0) {
                    $this->output .= $this->c1;
                    $this->c1 = " ";

                    if ($this->buffer[$index - 1] == "\n") {
                        $this->output .= "\n";
                    }
                }

                $this->output .= substr($this->buffer, $index, $this->index - $index - 1);

                return $c;
            }
        } else {
            $c = false;
        }

        if ($c === false) {
            throw new Exception('Unclosed multiline comment at: ' . ($this->index - 2));
        }

        if (isset($this->c3)) {
            unset($this->c3);
        }

        return $c;
    }

    /**
     *
     * @param  string $s
     * @return string|false
     */
    protected function find($s)
    {
        if (($pos = strpos($this->buffer, $s, $this->index)) === false) {
            return false;
        }

        $this->index = $pos;
        return substr($this->buffer, $this->index, 1);
    }

    /**
     *
     * @throws Exception Unclosed strings will throw an error
     */
    protected function _string()
    {
        $index = $this->index;
        $this->c1 = $this->c2;

        if ($this->c1 !== "'" && $this->c1 !== '"') {
            return;
        }

        $q = $this->c1;
        $this->output .= $this->c1;

        while (true)
        {
            $this->c1 = $this->_get();

            switch ($this->c1)
            {
                case $q:
                    break 2;

                case "\n":
                    throw new Exception('Unclosed string at: ' . $index);
                    break;

                case '\\':
                    $this->c2 = $this->_get();
                    if ($this->c2 == "\n") {
                        break;
                    }

                    $this->output .= $this->c1 . $this->c2;
                    break;

                default:
                    $this->output .= $this->c1;
            }
        }
    }

    /**
     *
     * @throws Exception Unclosed regex pattern
     */
    protected function _regexp()
    {
        $this->output .= $this->c1 . $this->c2;

        while (($this->c1 = $this->_get()) !== false)
        {
            if ($this->c1 == '/') {
                break;
            }

            if ($this->c1 == '\\') {
                $this->output .= $this->c1;
                $this->c1 = $this->_get();
            }

            if ($this->c1 == "\n") {
                throw new Exception('Unclosed regex pattern at: ' . $this->index);
            }

            $this->output .= $this->c1;
        }
        $this->c2 = $this->get();
    }

    /**
     *
     * @param  string $c
     * @return bool
     */
    protected function _alpha($c)
    {
        return $c == '/' || preg_match('/^[\w\$]$/', $c) === 1;
    }
}
