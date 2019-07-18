#!/usr/local/bin/node
'use strict';
/**
* @file move-files-array.js
* @brief Moves files listed in an array from one filesystem path to another.
* @author Anadian
* @copyright 	Copyright 2019 Canosw
	Permission is hereby granted, free of charge, to any person obtaining a copy of this 
software and associated documentation files (the "Software"), to deal in the Software 
without restriction, including without limitation the rights to use, copy, modify, 
merge, publish, distribute, sublicense, and/or sell copies of the Software, and to 
permit persons to whom the Software is furnished to do so, subject to the following 
conditions:
	The above copyright notice and this permission notice shall be included in all copies 
or substantial portions of the Software.
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

//Dependencies
	//Internal
	//Standard
	const FileSystem = require('fs');
	const Path = require('path');
	const Utility = require('util');
	//External
	const MoveFile = require('move-file');

//Constants
const FILENAME = 'move-files-array.js';
const MODULE_NAME = 'MoveFilesArray';
var PROCESS_NAME = '';
if(require.main === module){
	PROCESS_NAME = 'move-files-array';
} else{
	PROCESS_NAME = process.argv0;
}

//Global Variables
var Logger = { 
	log: () => {
		return null;
	}
};
//Functions
function Logger_Set( logger ){
	var _return = [1,null];
	const FUNCTION_NAME = 'Logger_Set';
	//Variables
	var function_return = [1,null];

	//Parametre checks
	if( typeof(logger) === 'object' ){
		if( logger === null ){
			logger = { 
				log: () => {
					return null;
				}
			};
		}
	} else{
		_return = [-2,'Error: param "logger" is not an object.'];
	}

	//Function
	if( _return[0] === 1 ){
		Logger = logger;
		_return = [0,null];
	}

	//Return
	return _return;
}
/**
* @fn FilesArrayFromInputData
* @brief Create an array of filepaths from a string, listing line-separated files.
* @param input_string
*	@type String
*	@brief The string of files, separated by line.
*	@default null
* @return <ARRAY>
*	@entry 0 
*		@retval 1 premature return.
*		@retval 0 on success.
*		@retval <0 on failure.
*	@entry 1
*		@retval <object> on success
*		@retval <error_message> on failure.
*/
function FilesArrayFromInputData( input_string ){
	var _return = [1,null];
	const FUNCTION_NAME = 'FilesArrayFromInputData';
	//Variables
	var split_array = [];

	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: Utility.format('received: ', arguments)});
	//Parametre checks
	if( input_string == undefined || typeof(input_string) !== 'string' ){
		_return = [-2, 'Error: param "input_String" is either null or not a string.'];
	}
	
	//Function
	if( _return[0] === 1 ){
		split_array = input_string.split(/\n|\r\n/)
		if( split_array[(split_array.length - 1)] === '' ){
			split_array.pop();
		}
		_return = [0,split_array];
	}

	//Return
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: Utility.format('returned: ', _return)});
	return _return;
}
/**
* @fn MoveFilesArray
* @brief Moves each file in the array from <source-prefix>/<array[index]:filename> to <destination-directory>/<array[index]:filename>
* @param files_array
*	@type Array
*	@brief The array of filepaths to be moved.
*	@default null
* @param source_prefix
*	@type String
*	@brief The directory the 'files_array' files are currently relative to.
*	@default null
* @param destination_directory
*	@type String
*	@brief The directory the files will be moved to.
*	@default null
* @param options
*	@type Object
*	@brief Additional options.
*	@note If "options" is a Boolean, it's interpretted as being the value for the "force" propery.
*		@property force
*			@type Boolean
*			@brief Force overwriting of files if necessary.
*			@default false
*		@property noop
*			@type Boolean
*			@brief Log what would be done without actually doing it.
*			@default false
*	@default false
* @return <ARRAY>
*	@entry 0 
*		@retval 1 premature return.
*		@retval 0 on success.
*		@retval <0 on failure.
*	@entry 1
*		@retval <object> on success
*		@retval <error_message> on failure.
*/
function MoveFilesArray( files_array, source_prefix, destination_directory, options ){
	var _return = [1,null];
	const FUNCTION_NAME = 'MoveFilesArray';
	//Variables
	var source_path = '';
	var destination_path = '';
	var move_file_options = {
		overwrite: false
	}
	var loop_error_string = '';
	var error_string = '';
	var move_file_function = MoveFile.sync;

	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: Utility.format('received: ', arguments)});
	//Parametre checks
	if( files_array == null || Array.isArray(files_array) !== true ){
		_return = [-2,'Error: param "files_array" is either null or not an array.'];
	}
	if( source_prefix != null && typeof(source_prefix) !== 'string' ){
		_return = [-3,'Error: param "source_prefix" is neither nul nor a string.'];
	}
	if( destination_directory == null || typeof(destination_directory) !== 'string' ){
		_return = [-4,'Error: param "destination_directory" is either null or not a string.'];
	}
	if( options != null && typeof(options) === 'object' ){
		if( options.force === true ){
			move_file_options.overwrite = true;
		}
		if( options.noop === true ){
			move_file_function = () => { return null; };
		}
	} else if( options === true ){
		move_file_options.overwrite = true;
	}
	//Function
	if( _return[0] === 1 ){
		for( var i = 0; i < files_array.length; i++ ){
			source_path = Path.join(source_prefix, files_array[i]);
			destination_path = Path.join(destination_directory, files_array[i]);
			Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'info', message: Utility.format('Moving "%s" to "%s"', source_path, destination_path)});
			try{
				move_file_function(source_path, destination_path, move_file_options);
			} catch(error){
				error_string = Utility.format('For loop index: %d: MoveFile.sync(%s, %s) threw: %s', i, source_path, destination_path, error);
				loop_error_string += error_string+' | ';
				Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'error', message: error_string});
			}
		}
		if( loop_error_string === '' ){
			_return = [0,null];
		} else{
			_return = [-8, loop_error_string];
		}
	}

	//Return
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: Utility.format('returned: ', _return)});
	return _return;
}

//Exports and Execution
if(require.main === module){
	var _return = [1,null];
	const FUNCTION_NAME = 'MainExecutionFunction';
	//Dependencies
		//Internal
		//Standard
		//External
		const MakeDir = require('make-dir');
		const ApplicationLogWinstonInterface = require('application-log-winston-interface');
		const EnvPaths = require('env-paths');
		const CommandLineArgs = require('command-line-args');
		const CommandLineUsage = require('command-line-usage');
		const GetStream = require('get-stream');
	//Constants
	const EnvironmentPaths = EnvPaths( PROCESS_NAME );
	const OptionDefinitions = [
		//UI
		{ name: 'help', alias: 'h', type: Boolean, description: 'Writes this help text to stdout.' },
		{ name: 'force', alias: 'f', type: Boolean, description: 'Force overwriting of files if necessary.' },
		{ name: 'noop', alias: 'n', type: Boolean, description: 'Show what would be done without actually doing it.' },
		{ name: 'verbose', alias: 'v', type: Boolean, description: 'Verbose output to stderr.' },
		{ name: 'Version', alias: 'V', type: Boolean, description: 'Writes version information to stdout.' },
		//Input
		{ name: 'stdin', alias: 'i', type: Boolean, description: 'Read input from stdin.' },
		{ name: 'input', alias: 'I', type: String, description: 'The path to the file to read input from.' },
		{name: 'source-prefix', alias: 's', type: String, description: '[Optional] The directory to find the files listed in the input.' },
		//Output
		{ name: 'stdout', alias: 'o', type: Boolean, description: 'Write output to stdout.' },
		{ name: 'output', alias: 'O', type: String, description: 'The name of the file to write output to.' },
		{ name: 'pasteboard', alias: 'p', type: Boolean, description: 'Copy output to pasteboard (clipboard).' },
		{name: 'destination-directory', alias: 'd', type: String, description: 'The directory to move the files listed in input to.' },
		//Config
		{ name: 'config', alias: 'c', type: Boolean, description: 'Print configuration values and information to stdout.' },
		{ name: 'config-file', alias: 'C', type: String, description: 'Use the given config file instead of the default.' },
	];
	//Variables
	var function_return = [1,null];
	var input_data = '';
	var files_array = [];
	var source_directory = '';
	var destination_directory = '';
	//Logger
	try{ 
		MakeDir.sync( EnvironmentPaths.log );
	} catch(error){
		console.error('MakeDir.sync threw: %s', error);
	}
	function_return = ApplicationLogWinstonInterface.InitLogger('debug.log', EnvironmentPaths.log);
	if( function_return[0] === 0 ){
		Logger_Set( function_return[1] );
	}
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: 'Start of execution block.'});
	//Options
	var Options = CommandLineArgs( OptionDefinitions );
	//Config
	//Main
	if(Options.help === true){
		const help_sections_array = [
			{
				header: 'move-files-array',
				content: 'Takes a line-separated list files (like the kind produced by "ls -1") and moves them all to a specified destination directory.',
			},
			{
				header: 'Options',
				optionList: OptionDefinitions
			}
		]
		const help_message = CommandLineUsage(help_sections_array);
		console.log(help_message);
	}
	if(Options.verbose === true){
		Logger.real_transports.console_stderr.level = 'debug';
		Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'note', message: Utility.format('Logger: console_stderr transport log level is now: %s', Logger.real_transports.console_stderr.level)});
	}
	//Input
	if( Options.stdin === true ){
		( async () => {
			try{
				function_return = [0,await GetStream(process.stdin)];
			} catch(error){
				function_return = [-8, Utility.format('GetStream threw: %s', error)];
				Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'error', message: function_return[1]});
			}
		} )();
		if( function_return[0] === 0 ){
			input_data = function_return[1];
		} else{
			_return = function_return;
		}
	} else if( Options.input != null && typeof(Options.input) === 'string' ){
		try{
			function_return = [0,FileSystem.readFileSync(Options.input, 'utf8')];
		} catch(error){
			function_return = [-9,Utility.format('FileSystem.readFileSync threw: %s', error)];
		}
		if( function_return[0] === 0 ){
			input_data = function_return[1];
		} else{
			_return = function_return;
		}
	} else{
		_return = [-4, 'Error: no input option specified.'];
	}
	if( _return[0] === 1 && input_data != null ){
		function_return = FilesArrayFromInputData( input_data );
		if( function_return[0] === 0 ){
			files_array = function_return[1];
			if( Options['source-prefix'] !== undefined && typeof(Options['source-prefix']) === 'string' ){
				source_directory = Options['source-prefix'];
			}
			if( Options['destination-directory'] !== undefined && typeof(Options['destination-directory']) === 'string' ){
				destination_directory = Options['destination-directory'];
			}
			function_return = MoveFilesArray( files_array, source_directory, destination_directory, Options );
			if( function_return[0] === 0 ){
				_return = [0,null];
			} else{
				_return = [function_return[0], 'MoveFilesArray: '+function_return[1]];
			}
		} else{
			_return = [function_return[0], 'FilesArraryFromInputData: '+function_return[1]];
		}
	} 
	if( _return[0] !== 0 ){
		process.exitCode = _return[0];
		Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'crit', message: Utility.format('Exiting with %d: %s', _return[0], _return[1])});
	}
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: 'End of execution block.'});
} else{
	exports.SetLogger = Logger_Set;
}
