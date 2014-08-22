<?php

use Acme\Interfaces\NotificationRepositoryInterface;


class NotificationsController extends \BaseController {

	protected $notification;

	function __construct(NotificationRepositoryInterface $notification)
	{
		$this->notification = $notification;
	}
	/**
	 * Display a listing of notifications of the authenticated user
	 *
	 * @return Response
	 */
	public function index()
	{
		// return $this->notification->getAll();
		$auth_id = Sentry::getUser()->id;
		return $this->notification->getAllAuthNotifications($auth_id);
	}

	/**
	 * Store a newly created notification in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		$user_id = Input::get('from_id');
		$to_id = Input::get('to_id');
		$request_type = Input::get('request_type');
		$input = [
			'from_id' => $user_id,
			'to_id' => $to_id,
			'type' => $request_type
		];

		$this->notification->store($input);
	}

	/**
	 * Remove the specified notification from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		$this->notification->delete($id);
	}

}
