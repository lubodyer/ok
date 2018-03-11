<?php
/**
 * 
 */

/**
 * 
 */
$modules = [
    [
        'id' => "content",
        'node' => "CONTENT_BOX",
        'o' => "_ok.content"
    ], [
        'id' => "module",
        'node' => "MODULE_BOX",
        'o' => "_ok.module"
    ]
];

// Transfer the list of modules to the client model
$ok->client->set('_ok.core', 'modules', $modules);
