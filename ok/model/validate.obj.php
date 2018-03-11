<?php
/**
 * This file contains the Validate OK System Object.
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
 * Validate - OK System Object
 *
 * @package System
 */
final class OK_Validate
{
    private static $boolean = array('0' => 1, '1' => 1, 'on' => 1, 'off' => 1, 'true' => 1, 'false' => 1, 'yes' => 1, 'no' => 1);
    private static $true = array('1' => 1, 'on' => 1, 'true' => 1, 'yes' => 1);
    private static $email = "/^[\pL\pN_-]+(\.[\pL\pN_-]+)*@[\pL\pN-]+(\.[\pL\pN-]+)*(\.[\pL]{2,12})$/u";

    /**
     *
     */
    private function __construct() { }

    // -----------

    /**
     * Finds out whether value is a valid boolean (OK style). Valid boolean values are the PHP booleans
     * true and false and the strings: 'on', 'off', 'yes', 'no', 'true' and 'false'.
     *
     * @param string $value
     * @param string $context (optional) Context must always be 'bool' or 'boolean' or false will be returned.
     *
     * @return boolean
     */
    public static function is_bool($value, $context = 'bool')
    {
        if ($context != 'bool' && $context != 'boolean')
            return false;

        if (is_bool($value) || is_numeric($value))
            return true;
        elseif (is_string($value))
            return isset(self::$boolean[strtolower($value)]);

        return false;
    }

    /**
     *
     */
    public static function is_regexp($value) {
        if (is_string($value) && preg_match("/^\/.+\/[gim]*$/i", $value))
            return true;
        return false;
    }

    /**
     *
     *
     */
    public static function is_true($value)
    {
        if (is_bool($value)) {
            return $value ? true : false;
        } elseif (is_numeric($value)) {
            return $value ? true : false;
        } elseif (is_string($value)) {
            return isset(self::$true[strtolower($value)]);
        }

        return false;
    }

    /**
     * Checks if value is a valid length. OK uses this function to validate 'width' and 'height'. Currently
     * the functionality is limited. See which values are valid below.
     *
     * To be considered valid value must be one of the following:
     *
     *  - Valid integer.
     *  - Empty string or the string 'auto'.
     *  - Percentage value - string consisting of an integer followed by '%'.
     *  - Pixel value - string consisting of an integer followed by 'px'.
     *
     * @param string $value
     *
     * @return boolean
     */
    public static function is_length($value)
    {
        $len = strlen($value);
        return empty($value) || ($value == "") || ($value == 'auto') || is_numeric($value) || (is_string($value) &&
            ((substr($value, $len-2) == 'px' && is_numeric(substr($value, 0, $len-2))) || (substr($value, $len-1) == '%' && is_numeric(substr($value, 0, $len-1)))));
    }

    /**
     * Validates value accorging to context.
     *
     * Context can be:
     *   - An array, in which case value will be required to exist in the array either as value or key.
     *   - String containing one of the standard PHP types: 'boolean' ('bool'), 'integer' ('int'), 'string'
     *     ('text'), 'float' ('double') or 'null'.
     *   - String containing one of the custom-defined types (currently only '{@link is_length length}').
     *
     * @param mixed $value
     * @param mixed $context
     *
     * @return boolean
     */
    public static function is_valid($value, $context)
    {
        if ($context == 'bool' || $context == 'boolean') {
            return self::is_bool($value);
        } elseif ($context == 'float' || $context == 'double') {
            settype($value, 'float');
            return is_float($value);
        } elseif ($context == 'int' || $context == 'integer') {
            settype($value, 'int');
            return is_int($value);
        } elseif ($context == 'string' || $context == 'text') {
            return is_string($value) || $value == "";
        } elseif ($context == 'length') {
            return self::is_length($value);
        } elseif ($context == 'null') {
            return is_null($value);
        } elseif ($context == 'regexp') {
            return self::is_regexp($value);
        } elseif ($context == 'email') {
            return preg_match(self::$email, $value);
        } elseif (is_array($context)) {
            return in_array($value, $context);
        }

        trigger_error("Unknown context \"$context\" while validating value.", E_USER_ERROR);
    }

}
