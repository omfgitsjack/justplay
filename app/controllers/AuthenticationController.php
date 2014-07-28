<?php

class AuthenticationController extends BaseController {

	public function __construct()
	{

	}
	
	public function getUserId()
	{
		return Sentry::getUser()->id;
	}

	public function postRegister()
	{
		try
		{
			$user = Sentry::createUser(array(
				'username' => Input::get('first_name'),
				'email' => Input::get('email'),
				'password' => Input::get('password'),
				'activated' => true,
				));

			if ($user) {
				//DB::insert('insert into profiles (user_id) values (?)', array($user->id));
				Profile::create([
					"user_id" => $user->id,
					'first_name' => Input::get('first_name')
				]);
			}

			return Response::json(
				array(
					'errors' => [],
					'obj' => array('success' => true)
				));
		}

		catch (Cartalyst\Sentry\Users\UserExistsException $e)
		{
			return 'Error in inserting user to the database:'+e;
		}
	}

	public function postLogin()
	{
		$credentials = array(
			'email' => Input::get('email'),
			'password' => Input::get('password')
			);

		try{

			$user = Sentry::authenticate($credentials, false);

			if($user)
			{
				//return 'bs';      
				//$user->with('profile')->get(); 

				return Response::json(User::with('profile')->where('id', '=', $user->id)->get()); //what i want
				/* 
				return Response::json(
 					array(
 						'errors' => [{}],
 						'obj' => array(
 							'id' => $user->id,
							'first_name' => $user->first_name,
 							'email' => $user->email
 							)
 					));

				*/
			}

			/*
{
"errors":[{
	"message":"Sorry, that page does not exist",
	"code":34
	}]
}


*/
		}
		catch (\Exception $e)
		{

			return Response::json(array(
					'login' => $e
					));
		}

	}

	public function logout()
	{
		Sentry::logout();
	}

}
