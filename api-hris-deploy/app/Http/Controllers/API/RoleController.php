<?php

namespace App\Http\Controllers\API;

use Exception;
use App\Models\Role;
use Illuminate\Http\Request;
use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use Illuminate\Support\Facades\Storage;

class RoleController extends Controller
{
    public function create(CreateRoleRequest $request)
    {
        try {
            $role = Role::create([
                'name' => $request->name,
                'company_id' => $request->company_id,
            ]);

            if (!$role) {
                throw new Exception('Role creation failed');
            }

            return ResponseFormatter::success($role, 'Role created successfully');
        } catch (Exception $e) {
            return ResponseFormatter::error($e->getmessage(), '500');
        }
    }

    public function update(UpdateRoleRequest $request, $id)
    {
        try {
            $role = Role::find($id);

            if (!$role) {
                throw new Exception('Role not found');
            }

            $data = [
                'name' => $request->name,
            ];

            // Update Role
            $role->update($data);

            return ResponseFormatter::success($role, 'Role updated successfully');
        } catch (Exception $e) {
            return ResponseFormatter::error($e->getMessage(), '500');
        }
    }

    public function fetch(Request $request)
    {
        $id = $request->input('id');
        $name = $request->input('name');
        $limit = $request->input('limit', 10);
        $with_responsibilities = $request->input('with_responsibilities', false);

        $roleQuery = Role::query();

        // Get Single Data
        if ($id) {
            $role = $roleQuery->with('responsibilities', 'company')->find($id);

            if ($role) {
                return ResponseFormatter::success($role, 'Role found');
            }

            return ResponseFormatter::error('Role not found', 404);
        }

        // Get multiple data
        $roles = $roleQuery->where('company_id', $request->company_id);

        if ($name) {
            $roles->where('name', 'like', '%' . $name . '%');
        }

        if ($with_responsibilities) {
            $roles->with(['responsibilities']);
        }

        return ResponseFormatter::success($roles->paginate($limit), 'Roles found');
    }

    public function delete($id)
    {
        try {
            $role = Role::find($id);

            // TODO : Check if role is owned by the user

            if (!$role) {
                throw new Exception('Role not found');
            }

            $role->delete();

            return ResponseFormatter::success(null, 'Role deleted successfully');
        } catch (Exception $e) {
            return ResponseFormatter::error($e->getMessage(), '500');
        }
    }
}
